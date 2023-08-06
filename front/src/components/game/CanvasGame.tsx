 "use client"
import {RefObject, useEffect, useRef, useState } from "react";
import {Socket, io} from 'socket.io-client';
import {Player, Ball, ballSpeed, TableMap} from '../../../tools/class';
import Cookies from "js-cookie";
import LoginHook from '@/hooks/auth/login';
import {drawBackground, drawScore, Player1Draw, Player2Draw, drawingBall} from './gameFunc';
import LeaveButton from '@/components/game/LeaveButton';
import { set } from "react-hook-form";

const TableMap: TableMap = new Map();
const IPmachine = '10.13.1.9/game';
const IPmachineBall = '10.13.1.9/ball';
const AllTime = 30;

/// game settings /// on % of the canvas
var player_width = 6.25;

function pongFunc(divRef: RefObject<HTMLDivElement>) {
  
  const  canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const DivCanvas = isMounted ? document.getElementById('CanvasGameDiv'): null;
  const [Table_obj, setTable_obj] = useState<any>(null);
  const [Status, setStatus] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [ballSocket, setBallSocket] = useState<any>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [images, setImages] = useState<{ img1: HTMLImageElement | null, img2: HTMLImageElement | null, pause: HTMLImageElement | null}>({
        img1: null,
        img2: null,
        pause: null,
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
    let interval: any = null;
    const loginhook = LoginHook();
    const [YouWin, setYouWin] = useState(false);
    const [YouLose, setYouLose] = useState(false);
    const [YouDraw, setYouDraw] = useState(false);
    let listenGameOver = false;
    // const [listenGameOver, setListenGameOver] = useState(false);

    // useEffect(() => {
    //   const userAgent = window.navigator.userAgent;
    //   const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    //   const isMobileDevice = mobileRegex.test(userAgent);
  
    //   setIsMobile(isMobileDevice);
    // }, []);

    function handleRemoveCanvas() {
      // canvas?.parentNode?.contains(canvas) && canvas?.parentNode?.removeChild(canvas);
      DivCanvas?.parentNode?.contains(DivCanvas) && DivCanvas?.parentNode?.removeChild(DivCanvas);
    };

    function StartPause(e: KeyboardEvent) {
        if (isReady && e.key == ' ' && Status == false) {
          socket.emit('setStatus', {status:true, tableId: Table_obj.tableId});
        }
        else if (isReady && e.key == ' ' && Status == true)
            socket.emit('setStatus', {status:false, tableId: Table_obj.tableId});
      }

    function MouseFunction(event: { clientX: number; clientY: number; }) {
      if (!Status)
      return;
        var updatePlayer;
        var max_variable = 100 - (100 / player_width);
        if (isMounted && canvas) {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
            var position1 = Player1;
            var position2 = Player2;
            var is_vertical = canvas.height > canvas.width ? true : false;
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

    function keyFunction(e: KeyboardEvent) {
      var position1 = Player1;
      var position2 = Player2;
        var max_variable = 100 - (100 / player_width);
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
      var height = 0;
      var width = 0;
      if (divRef.current && divRef.current.offsetParent) {
          const dashboardRect = divRef.current.offsetParent.getBoundingClientRect();
          const headerHeight = divRef.current.offsetParent.querySelector('header')?.getBoundingClientRect().height ?? 0;
          var sideBarwidth = document.getElementById('Sidebar')?.getBoundingClientRect().width ?? 0;
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
    
    // check if the user is logged in
    useEffect(() => {
        if (!Cookies.get('token'))
            loginhook.onOpen();
    }, [])

    // useEffect for loading the images and initializing the canvas
    useEffect(() => {
      if (!isReady)
        return;
    Table_obj.imageLoad == 0;
    const img1 = new Image();
    const img2 = new Image();
    const pause = new Image();
    function checkImageLoaded() {
        Table_obj.imageLoad++;
        if (Table_obj.imageLoad == 3) {
            setImages({
                img1:img1,
                img2:img2,
                pause:pause,
            })
        }
    }
    img1.src = Table_obj.player1.GameSetting.avatar;
    img2.src = Table_obj.player2.GameSetting.avatar;
    pause.src = "/pause.png";
    img1.onload = checkImageLoaded;
    img2.onload = checkImageLoaded;
    pause.onload = checkImageLoaded;
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
          // socket && socket.on("disconnecting", () => {
          //     socket.emit("disconnecting", "test printing");
          // })
          Cookies.remove('tableId');
          socket && socket.disconnect();
          socketBall && socketBall.disconnect();
      };
      // socket && socket.on("connected", (data) => {
      //     console.log("socket %s connected", socket.id);
      // })
  
  //client namespace disconnect
  // transport close
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
        const obj = drawBackground(Table_obj, canvas, canvasSize, socket, DivCanvas);
        setScore({first: Table_obj.player1.score, second: Table_obj.player2.score});
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", MouseFunction)
        window.addEventListener("keydown", StartPause)
        return () => {
          obj.backgroundCtx && obj.backgroundCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
          canvas?.parentNode && canvas.parentNode.contains(obj.backgroundLayer) && canvas.parentNode.removeChild(obj.backgroundLayer);
          window.removeEventListener("resize", handleResize);
          window.removeEventListener("mousemove", MouseFunction)
          window.removeEventListener("keydown", StartPause)
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
        const obj = drawScore(canvas, images, Table_obj, Status, isMobile, timer, socket);
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
            // handleRemoveCanvas();
              obj1 && obj1.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
              canvas?.parentNode && obj1 && canvas.parentNode.removeChild(obj1.playerLayer);
              obj2 && obj2.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
              canvas?.parentNode && obj2 && canvas.parentNode.removeChild(obj2.playerLayer);
                window.removeEventListener("keydown", keyFunction);
          }
      }
    }, [canvasSize, Player1, Player2, Status, LeaveGame])



    // useEffect(() => {
    //   if (!Status)
    //     Table_obj && clearInterval(Table_obj.currentTimer);
    //   if (Status && isReady && Table_obj.countdown > 0 && socket.id == Table_obj.player1.UserId) {
    //     clearInterval(Table_obj.currentTimer);
    //     Table_obj.currentTimer = setInterval(() => {
    //       Table_obj.countdown -= 1;
    //       console.log("timing: ", Table_obj.countdown);
    //     }, 1000);
    //   }
    // }, [Status])
    // useEffect for ball
    useEffect(() => {
      if (isReady) {
          const obj = drawingBall(canvas, BallObj, socket, Table_obj, canvasSize);
          Table_obj.player2.UserId == 'Bot' && BallObj.y > 8 && BallObj.y < 92 && socket.emit("setBot", {Player: BallObj.y - 8, tableId: Table_obj.tableId}) && setPlayer2(BallObj.y - 8);   /////////////// bot /////////////// need more calculation
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

      isMounted && socket.on('joinRoomGame', (table: any) => {
        console.log("test join room")
        if (table) {
          TableMap.set(table.tableId, table);
          setTable_obj(table);
          socket.emit('joinToRoomGame', table.tableId);
        }
      })

      isMounted && ballSocket.on('joinRoomBall', (table: string) => {
        // console.log("check--------");
        ballSocket.emit('joinToRoomBall', table);
      })

      isMounted && socket.on('ready', (check: boolean) => {
        setIsReady(check);
      })

      // isMounted && socket.on('reload', (table: any) => {

      // })

      isMounted && socket.on('setPlayer1', (Player:number) => {
        setPlayer1(Player);
      })

      isMounted && socket.on('setPlayer2', (player: number) => {
          setPlayer2(player);
        })

      isMounted && ballSocket.on('setBall', (ball: any) => {
        if (!Status && isReady)
        setBallObj(ball);
        })
      

      isMounted && ballSocket.on('timer', (time: number) => {
        if (!Math.floor(AllTime - time) && Status) {
          // setStatus(false);
          socket.emit('setStatus', {status:false, tableId: Table_obj.tableId});
          socket.emit('GameOver', {tableId: Table_obj.tableId});
        }
        else
          setTimer(Math.floor(AllTime - time));
      })

      if (!listenGameOver) {
        console.log('test game over');
        isMounted && socket.on('GameOver', (Winner: any) => {
          // if (!listenGameOver) {
            listenGameOver = true;
            setLeaveGame(true);
            console.log('test game over', LeaveGame, YouWin, YouLose, YouDraw);
            if (socket.auth.UserId == Winner)
              setYouWin(true);
            else if (Winner == 'no one')
              setYouDraw(true);
            else
              setYouLose(true);
            socket.emit('deletePlayer');
          // }
        })
      }

      isMounted && socket.on('setStatus', (status: boolean) => {
        setStatus(status);
        })

      isMounted && isReady && ballSocket && ballSocket.on('setScore1', (score: number) => {
        Table_obj.player1.score = score;
        setScore({first: score, second: Table_obj.player2.score});
      })
      
      isMounted && isReady && ballSocket && ballSocket.on('setScore2', (score: number) => {
        Table_obj.player2.score = score;
        setScore({first: Table_obj.player1.score, second: score});
      })

      isMounted && socket.on('leaveGame', (id: string) => {
        if (socket.id != id)
          setLeaveGame(true);
        // console.log("leaveGame");
      })

      if (canvasSize.width < canvasSize.height)
          var isvertical = true;
      else
          var isvertical = false;
    return (
      LeaveGame && (YouWin || (!YouWin && !YouLose && !YouDraw))  ? <h1 className=" font-bold text-white">WIN</h1> :
      LeaveGame && YouLose ? <h1 className=" font-bold text-white">LOSE</h1> :
      LeaveGame && YouDraw ? <h1 className=" font-bold text-white">DRAW</h1> :
      <>
        <LeaveButton isvertical={isvertical} isReady={isReady} isMobile={isMobile} />
        <div id="CanvasGameDiv">
          <canvas id="GameCanvas" ref={canvasRef} width={isvertical ? canvasSize.width * 1.15 : canvasSize.width} height={isvertical ? canvasSize.height : canvasSize.height * 1.15} />
        </div>
      </>

    );
}

export default function CanvasGame() {
    const divRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={divRef} className='flex flex-col gap-2 w-full h-full justify-center items-center'>
        {pongFunc(divRef)}
    </div>
  );
}
