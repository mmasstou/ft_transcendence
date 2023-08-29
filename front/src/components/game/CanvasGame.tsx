"use client"
import {RefObject, useEffect, useRef, useState } from "react";
import {Socket, io} from 'socket.io-client';
import {TableMap} from '../../types/gameType';
import Cookies from "js-cookie";
import {drawBackground, drawScore, Player1Draw, Player2Draw, drawingBall} from './gameFunc';
import GameResult from "./GameResult";
import MatchMaking from "./MatchMaking";
import { useRouter } from "next/navigation";

const TableMap: TableMap = new Map();
const url = process.env.NEXT_PUBLIC_SOCKET_URL;
const IPmachine = url + '/game';
const IPmachineBall = url + '/ball';
const AllTime = 75;
const targetScore = 5;

/// game settings /// on % of the canvas
let player_width = 6.25;

function pongFunc(divRef: RefObject<HTMLDivElement>, router: any) {
  
  let     isvertical;
  const   canvasRef = useRef<HTMLCanvasElement>(null);
  const   [isMounted, setIsMounted] = useState(false);
  const   DivCanvas = isMounted ? document.getElementById('CanvasGameDiv'): null;
  const   [Table_obj, setTable_obj] = useState<any>(null);
  const   [Status, setStatus] = useState(false);
  const   [socket, setSocket] = useState<any>(null);
  const   [ballSocket, setBallSocket] = useState<any>(null);
  const   [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const   [images, setImages] = useState<{ img1: HTMLImageElement | null, img2: HTMLImageElement | null, pause: HTMLImageElement | null, exit: HTMLImageElement | null}>({
        img1: null,
        img2: null,
        pause: null,
        exit: null, 
      });
    const [Player1, setPlayer1] = useState(Table_obj ? Table_obj.player1.position : 50);
    const [Player2, setPlayer2] = useState(Table_obj ? Table_obj.player2.position : 50);
    const [BallObj, setBallObj] = useState({
        x: 0,
        y: 0,
    });
    const [LeaveGame, setLeaveGame] = useState(false);
    const [Score, setScore] = useState({first: Table_obj ? Table_obj.player1.score : 0, second: Table_obj ? Table_obj.player2.score : 0});
    const [canvasSize, SetCanvasSize] = useState({
        width: 0,
        height: 0,
    });
    const [isReady, setIsReady] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [timer, setTimer] = useState(AllTime);
    const [YouWin, setYouWin] = useState(false);
    const [YouLose, setYouLose] = useState(false);
    const [YouDraw, setYouDraw] = useState(false);

    function handleRemoveCanvas() {
      DivCanvas?.parentNode?.contains(DivCanvas) && DivCanvas?.parentNode?.removeChild(DivCanvas);
    };

    function StartPause(e: KeyboardEvent) {
        if (isReady && e.key == ' ' && Status == false) {
          socket.emit('setStatus', {status:true, tableId: Table_obj.tableId});
        }
        else if (isReady && e.key == ' ' && Status == true)
            socket.emit('setStatus', {status:false, tableId: Table_obj.tableId});
      }

    async function ExitGame(event: { clientX: number; clientY: number; }) {
      if (isMounted && canvas && !Status) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const is_vertical = canvasSize.height > canvasSize.width ? true : false;
        const radius = is_vertical ? canvasSize.width * 0.06: canvasSize.height * 0.06;
        if (
          (is_vertical && x >= (canvasSize.width) && x <= (canvasSize.width + (radius * 3)) && (y >= (canvasSize.height * (2 / 3) - (radius * 2.5))) && y <= (canvasSize.height * (2 / 3)))
          || (!is_vertical && x >= (canvasSize.width * (2 / 3) - radius * 2.5) && x <= (canvasSize.width * (2 / 3)) && y >= (canvasSize.height) && y <= (canvasSize.height + (radius * 3)))
            ) {
              router.push('/game');
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/game/leaveGame`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  UserId: Cookies.get('_id'),
                  TableId: Cookies.get('tableId'),
                }),
              });
    }
  }
}

    function MouseFunction(event: { clientX: number; clientY: number; }) {
      if (isMounted && canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const is_vertical = canvasSize.height > canvasSize.width ? true : false;
        const radius = is_vertical ? canvasSize.width * 0.06: canvasSize.height * 0.06;
        if (!Status) {
          if (
            (is_vertical && x >= (canvasSize.width) && x <= (canvasSize.width + (radius * 3)) && (y >= (canvasSize.height * (2 / 3) - (radius * 2.5))) && y <= (canvasSize.height * (2 / 3)))
            || (!is_vertical && x >= (canvasSize.width * (2 / 3) - radius * 2.5) && x <= (canvasSize.width * (2 / 3)) && y >= (canvasSize.height) && y <= (canvasSize.height + (radius * 3)))
            ) {
            DivCanvas && (DivCanvas.style.cursor = "pointer");
        } else {
          DivCanvas && (DivCanvas.style.cursor = "default");
        }
        }
        else {
          let updatePlayer;
          let max_variable = 100 - (100 / player_width);
          if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
            let position1 = Player1;
            let position2 = Player2;
            let is_vertical = canvas.height > canvas.width ? true : false;
            if (is_vertical && isMounted && socket.auth.UserId == Table_obj.player1.UserId) {
                updatePlayer = position1 >= 0 && position1 <= max_variable && (x / canvas.width) * 100 <= max_variable && (x / canvas.width) * 100 >= 0 ? Math.round((x / canvas.width) * 100) : position1;
                if (updatePlayer != position1)
                  socket.emit("setPlayer1", {Player: updatePlayer, tableId: Table_obj.tableId});
              }
            else if (is_vertical && isMounted && socket.auth.UserId == Table_obj.player2.UserId) {
              updatePlayer = position2 >= 0 && position2 <= max_variable && (x / canvas.width) * 100 <= max_variable && (x / canvas.width) * 100 >= 0 ? Math.round((x / canvas.width) * 100) : position2;
              if (updatePlayer != position2)
              socket.emit("setPlayer2", {Player: updatePlayer, tableId: Table_obj.tableId});
              }
            else if (!is_vertical && isMounted && socket.auth.UserId == Table_obj.player1.UserId) {
              updatePlayer = position1 >= 0 && position1 <= max_variable && (y / canvas.height) * 100 <= max_variable && (y / canvas.height) * 100 >= 0 ? Math.round((y / canvas.height) * 100) : position1;
              if (updatePlayer != position1)
              socket.emit("setPlayer1", {Player: updatePlayer, tableId: Table_obj.tableId});
              }
            else if (!is_vertical && isMounted && socket.auth.UserId == Table_obj.player2.UserId) {
              updatePlayer = position2 >= 0 && position2 <= max_variable && (y / canvas.height) * 100 <= max_variable && (y / canvas.height) * 100 >= 0 ? Math.round((y / canvas.height) * 100) : position2;
              if (updatePlayer != position2)
              socket.emit("setPlayer2", {Player: updatePlayer, tableId: Table_obj.tableId});
              }
            }
            }
          }
      }

    function moveBot() {
      if (BallObj.y > 8 && BallObj.y < 92 && BallObj.x < 50) {
        const random =( Math.random() * 0.5) + 0.5;
        if (Math.round(BallObj.y) > Math.round(Player2 + 8)) {
          socket.emit("setBot", {Player: Player2 + 1, tableId: Table_obj.tableId});
          setPlayer2(Player2 + random);
        }
        else if (Math.round(BallObj.y) < Math.round(Player2 + 8)) {
          socket.emit("setBot", {Player: Player2 - 1, tableId: Table_obj.tableId});
          setPlayer2(Player2 - random);
        }
      }
    }

    function handleTouchMove(e: TouchEvent) {
      console.log(e.touches[0].clientX, e.touches[0].clientY)
      MouseFunction({clientX: e.touches[0].clientX, clientY: e.touches[0].clientY})
    }

    function keyFunction(e: KeyboardEvent) {
      let position1 = Player1;
      let position2 = Player2;
        let max_variable = 100 - (100 / player_width);
        if ((e.key == 'ArrowLeft' || e.key == 'ArrowRight') && Status) {
            if (e.key == 'ArrowLeft'){
              if (socket.auth.UserId == Table_obj.player1.UserId && position1 >= 1) {
                if (position1 >= 5)
                    socket.emit("setPlayer1", {Player: position1 - 5, tableId: Table_obj.tableId});
                else
                  socket.emit("setPlayer1", {Player: position1 - 1, tableId: Table_obj.tableId});
              }
              else if (socket.auth.UserId == Table_obj.player2.UserId && position2 >= 1) {
                if (position2 >= 5)
                  socket.emit("setPlayer2", {Player: position2 - 5, tableId: Table_obj.tableId});
                else
                  socket.emit("setPlayer2", {Player: position2 - 1, tableId: Table_obj.tableId});
              }
            }
            else if (e.key == 'ArrowRight'){
              if (socket && socket.auth.UserId == Table_obj.player1.UserId && position1 < max_variable) {
                if (position1 <= max_variable - 5)
                  socket.emit("setPlayer1", {Player: position1 + 5, tableId: Table_obj.tableId});
                else
                  socket.emit("setPlayer1", {Player: position1 + 1, tableId: Table_obj.tableId});
              }
              else if (socket.auth.UserId == Table_obj.player2.UserId && position2 < max_variable)
                if (position2 <= max_variable - 5)
                  socket.emit("setPlayer2", {Player: position2 + 5, tableId: Table_obj.tableId});
                else
                  socket.emit("setPlayer2", {Player: position2 + 1, tableId: Table_obj.tableId});
            }
          }
    }

    function handleResize() {
      let height = 0;
      let width = 0;
      if (divRef.current && divRef.current.offsetParent) {
          const dashboardRect = divRef.current.offsetParent.getBoundingClientRect();
          const headerHeight = divRef.current.offsetParent.querySelector('header')?.getBoundingClientRect().height ?? 0;
          let sideBarwidth = document.getElementById('Sidebar')?.getBoundingClientRect().width ?? 0;
          if (sideBarwidth === dashboardRect.width)
              sideBarwidth = 0;
          height = (dashboardRect.height - headerHeight) * 0.9;
          width = (dashboardRect.width - sideBarwidth) * 0.9;
      }
      isMounted && !LeaveGame && socket.emit('setStatus', {status:false, tableId: Table_obj.tableId});
      if (height > width) {
          SetCanvasSize({
              width: (width - (width * 0.15)),
              height: height,
          })
      }
      else {
          SetCanvasSize({
              width: width,
              height: (height - (height * 0.15)),
          })
      }
    }

    // useEffect for loading the images and initializing the canvas
    useEffect(() => {
      if (!isReady)
        return;
    Table_obj.imageLoad == 0;
    const img1 = new Image();
    const img2 = new Image();
    const pause = new Image();
    const exit = new Image();
    function checkImageLoaded() {
        Table_obj.imageLoad++;
        if (Table_obj.imageLoad == 4) {
            setImages({
                img1:img1,
                img2:img2,
                pause:pause,
                exit:exit,
            })
        }
    }
    img1.src = Table_obj.player1.GameSetting.avatar;
    img2.src = Table_obj.player2.GameSetting.avatar;
    pause.src = "/pause.png";
    exit.src = "/exit.png";
    img1.onload = checkImageLoaded;
    img2.onload = checkImageLoaded;
    pause.onload = checkImageLoaded;
    exit.onload = checkImageLoaded;
    handleResize();
    setBallObj({
        x:Table_obj.ball.x,
        y:Table_obj.ball.y,
    })
    setPlayer1(Table_obj.player1.position);
    setPlayer2(Table_obj.player2.position);
    if (canvasRef.current) {
        setCanvas(canvasRef.current);
    }
    window.addEventListener("resize", handleResize);
    
    return () => {
        window.removeEventListener("resize", handleResize);
    }
    }, [isReady])

    // create client socket for the game
    useEffect(() => {
      const token = Cookies.get("token");
      if (!token) return;
      const socket: Socket = io(IPmachine, {
          auth: {
              token: `${token}`,
              UserId: `${Cookies.get("_id")}`,
              Username: Cookies.get('username'),
              tableId: Cookies.get('tableId')
          }
      });
      const socketBall: Socket = io(IPmachineBall, {
        auth: {
            token: `${token}`,
            UserId: `${Cookies.get("_id")}`,
            Username: Cookies.get('username'),
            tableId: Cookies.get('tableId')
        }
    });
      setSocket(socket);
      setBallSocket(socketBall);
      setIsMounted(true);

      return () => {
          Cookies.remove('tableId');
          socket && socket.disconnect();
          socketBall && socketBall.disconnect();
      };
  }, [])
    
    // useEffect for background
    useEffect(() => {
      if (LeaveGame) {
        handleRemoveCanvas();
        return
      }
      if (isReady) {
        if (!Cookies.get('tableId'))
          Cookies.set('tableId', Table_obj.tableId);
        const obj = drawBackground(Table_obj, canvas, canvasSize, socket, DivCanvas, images);
        setScore({first: Table_obj.player1.score, second: Table_obj.player2.score});
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", MouseFunction)
        window.addEventListener("keydown", StartPause)
        window.addEventListener("click", ExitGame);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        return () => {
          obj.backgroundCtx && obj.backgroundCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
          canvas?.parentNode && canvas.parentNode.contains(obj.backgroundLayer) && canvas.parentNode.removeChild(obj.backgroundLayer);
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("mousemove", MouseFunction);
          window.removeEventListener('click', ExitGame);
          window.removeEventListener("keydown", StartPause);
          window.removeEventListener('touchmove', handleTouchMove);
        }
      }
            
    }, [canvasSize, images, Status, LeaveGame])

    // useEffect for Score
    useEffect(() => {
      const userAgent = window.navigator.userAgent;
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent);
      setIsMobile(isMobileDevice);

      if (isReady) {
        const obj = drawScore(canvas, images, Table_obj, Status, isMobile, timer, targetScore, socket);
        if (Table_obj.GameMode == 'score' && (Score.first == targetScore || Score.second == targetScore)) {
          socket.emit('setStatus', {status:false, tableId: Table_obj.tableId});
          socket.emit('GameOver', {tableId: Table_obj.tableId});
        }
        return () => {
            obj && obj.ScoreCtx && obj.ScoreCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && canvas.parentNode.removeChild(obj.ScoreLayer);
        }
      }
    }, [canvasSize, images, Score, Status, isReady, LeaveGame, timer]) 

    // useEffect for Player
    useEffect(() => {
      if (isReady) {
          const obj1 = Player1Draw(canvas, socket, Table_obj, canvasSize, player_width, Player1, Player2);
          const obj2 = Player2Draw(canvas, socket, Table_obj, canvasSize, player_width, Player1, Player2);
          window.addEventListener("keydown", keyFunction);
          return () => {
              obj1 && obj1.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
              canvas?.parentNode && obj1 && canvas.parentNode.removeChild(obj1.playerLayer);
              obj2 && obj2.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
              canvas?.parentNode && obj2 && canvas.parentNode.removeChild(obj2.playerLayer);
                window.removeEventListener("keydown", keyFunction);
          }
      }
    }, [canvasSize, Player1, Player2, Status, LeaveGame])

    // useEffect for ball
    useEffect(() => {
      if (isReady) {
          const obj = drawingBall(canvas, BallObj, socket, Table_obj, canvasSize);
          Table_obj.player2.UserId == 'Bot' && moveBot();
          return () => {
            obj.ballCtx && obj.ballCtx.clearRect(0, 0,  canvasSize.width, canvasSize.height);
            canvas?.parentNode && canvas.parentNode.removeChild(obj.ballLayer);
          }
      }
      }, [BallObj, canvasSize, isReady, LeaveGame])

    // useEffect for emit the status to the server
    useEffect(() => {
      ballSocket && isReady &&  ballSocket.emit('moveBall', Table_obj.tableId);
    }, [Status])


    ////////////////////// emit from the server ///////////////////////
    useEffect(() => {
      if (isMounted) {
        socket.on('joinRoomGame', (table: any) => {
          if (table) {
            TableMap.set(table.tableId, table);
            setTable_obj(table);
            socket.emit('joinToRoomGame', table.tableId);
          }
        })
        
        ballSocket.on('joinRoomBall', (table: string) => {
          ballSocket.emit('joinToRoomBall', table);
        })
  
        socket.on('ready', (check: boolean) => {
          setIsReady(check);
        })
  
        isMounted && socket.on('setPlayer1', (Player:number) => {
          setPlayer1(Player);
        })

        socket.on('setPlayer2', (player: number) => {
            setPlayer2(player);
        })
  
        socket.on('setStatus', (status: boolean) => {
          setStatus(status);
        })
  
        Table_obj && ballSocket.on('setScore1', (score: number) => {
          Table_obj.player1.score = score;
          setScore({first: score, second: Table_obj.player2.score});
        })
        
        Table_obj && ballSocket.on('setScore2', (score: number) => {
          Table_obj.player2.score = score;
          setScore({first: Table_obj.player1.score, second: score});
        })

        isMounted && socket.on('leaveGame', (id: string) => {
            if (socket.id != id) {
              setLeaveGame(true);
            }
        })
        //ballObj: any, socket: Socket, Table_obj: any, canvasSize: any, setPlayer2: any, isReady: any, canvas: any
        ballSocket.on('setBall', (ball: any) => {
          if (!Status && isReady)
          setBallObj(ball);
        })
      }
    }, [isMounted, isReady, Status, Table_obj])

    useEffect(() => {
      if (isReady) {
        ballSocket.on('timer', (time: number) => {
          if (Status) {
            if (Table_obj.GameMode == 'time' && !Math.floor(AllTime - time) && Status) {
              socket.emit('setStatus', {status:false, tableId: Table_obj.tableId});
              socket.emit('GameOver', {tableId: Table_obj.tableId});
            }
            else
              setTimer(Math.floor(AllTime - time));
          }
        })
        socket.on('GameOver', (Winner: any) => {
          setLeaveGame(true);
          if (socket.auth.UserId == Winner)
            setYouWin(true);
          else if (Winner == 'no one')
            setYouDraw(true);
          else
            setYouLose(true);
        })
      }
    }, [isReady, Status])
    
    useEffect(() => {
      if (isReady && (YouWin || YouLose || YouDraw)) {
        Cookies.remove('tableId');
        socket.emit('deletePlayer');
      }
    }, [YouWin, YouLose, YouDraw])

    if (canvasSize.width < canvasSize.height)
        isvertical = true;
    else
        isvertical = false;
    return (
      !isReady ? <MatchMaking/> :
      LeaveGame && (YouWin || (!YouWin && !YouLose && !YouDraw))  ? <GameResult result="win" /> :
      LeaveGame && YouLose ? <GameResult result="lose" /> :
      LeaveGame && YouDraw ? <GameResult result="draw" /> :
      <div id="CanvasGameDiv">
        <canvas id="GameCanvas" ref={canvasRef} width={isvertical ? canvasSize.width * 1.15 : canvasSize.width} height={isvertical ? canvasSize.height : canvasSize.height * 1.15} />
      </div>
    );
}

export default function CanvasGame() {
    const divRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
  return (
    <div ref={divRef} className='flex flex-col gap-2 w-full h-full justify-center items-center'>
        {pongFunc(divRef, router)}
    </div>
  );
}
