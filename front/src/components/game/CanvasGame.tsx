 "use client"
import {RefObject, useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client';
import {Player, Ball, ballSpeed, TableMap} from '../../../tools/class';
import Cookies from "js-cookie";
import LoginHook from '@/hooks/auth/login';
import {drawBackground, drawScore, Player1Draw, Player2Draw, drawingBall} from './gameFunc';

// var table_obj = {
//     player1: new Player(),
//     player2: new Player(),
//     ball: new Ball(),
//     Status: false,
//     tableId: '',
//     GameMode: '',
// }
const TableMap: TableMap = new Map();
const IPmachine = '10.13.1.1/game';
const IPmachineBall = '10.13.1.1/ball';
var imageLoad = 0;

/// game settings /// on % of the canvas
var player_width = 6.25;

function pongFunc(divRef: RefObject<HTMLDivElement>) {
    const  canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [Table_obj, setTable_obj] = useState<any>(null);
    const [Status, setStatus] = useState(false);
    const [socket, setSocket] = useState<any>(null);
    const [ballSocket, setBallSocket] = useState<any>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [images, setImages] = useState<{ img1: HTMLImageElement | null, img2: HTMLImageElement | null}>({
        img1: null,
        img2: null,
      });
    const [Player1, setPlayer1] = useState(Table_obj ? Table_obj.player1.position : 50);
    const [Player2, setPlayer2] = useState(Table_obj ? Table_obj.player2.position : 50);
    const [BallObj, setBallObj] = useState({
        x: 0,
        y: 0,
    });
    const [Score, setScore] = useState({first: Table_obj ? Table_obj.player1.score : 0, second: Table_obj ? Table_obj.player2.score : 0});
    const [canvasSize, SetCanvasSize] = useState({
        width: 0,
        height: 0,
    });
    const [isReady, setIsReady] = useState(false);
    const loginhook = LoginHook();
    const Token = Cookies.get('token');
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
      isMounted && socket.emit('setStatus', {status:false, tableId: Table_obj.tableId});
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
    const img1 = new Image();
    const img2 = new Image();
    function checkImageLoaded() {
        imageLoad++;
        if (imageLoad == 2) {
            setImages({
                img1:img1,
                img2:img2,
            })
        }
    }
    img1.src = Table_obj.player1.GameSetting.avatar;
    img2.src = Table_obj.player2.GameSetting.avatar;
    img1.onload = checkImageLoaded;
    img2.onload = checkImageLoaded;
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

    // useEffect for socket
    useEffect(() => {
      if (!Cookies.get('token'))
        return;
      setSocket(io(IPmachine, {auth: {token: Cookies.get('token'), UserId: Cookies.get('_id'), Username: Cookies.get('username'), tableId: Cookies.get('tableId')}}));
      setBallSocket(io(IPmachineBall ,{auth: {token: Cookies.get('token'), UserId: Cookies.get('_id'), Username: Cookies.get('username'), tableId: Cookies.get('tableId')}}));
      setIsMounted(true);
    }, [Token]);


    // useEffect for background
    useEffect(() => {
      if (isReady) {
        if (!Cookies.get('tableId'))
          Cookies.set('tableId', Table_obj.tableId);
        const obj = drawBackground(Table_obj, canvas, canvasSize, socket);
        setScore({first: Table_obj.player1.score, second: Table_obj.player2.score});
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", MouseFunction)
        window.addEventListener("keydown", StartPause)
        return () => {
            obj.backgroundCtx && obj.backgroundCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && canvas.parentNode.removeChild(obj.backgroundLayer);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", MouseFunction)
            window.removeEventListener("keydown", StartPause)
        }
      }
            
    }, [canvasSize, images, Status])

    // useEffect for Score
    useEffect(() => {
      if (isReady) {
        const obj = drawScore(canvas, images, socket, Table_obj);
        return () => {
            obj.ScoreCtx && obj.ScoreCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && canvas.parentNode.removeChild(obj.ScoreLayer);
        }
      }
    }, [canvasSize, images, Score, Status, isReady]) 

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
    }, [canvasSize, Player1, Player2, Status])

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
      }, [BallObj, canvasSize, isReady])

    // useEffect for emit the status to the server
    useEffect(() => {
      ballSocket && isReady &&  ballSocket.emit('moveBall', Table_obj.tableId);
    }, [Status])

      ////////////////////// emit from the server ///////////////////////

      isMounted && socket.on('joinRoomGame', (table: any) => {
        TableMap.set(table.tableId, table);
        setTable_obj(table);
        socket.emit('joinToRoomGame', table.tableId);
      })

      isMounted && ballSocket.on('joinRoomBall', (table: string) => {
        ballSocket.emit('joinToRoomBall', table);
      })

      isMounted && socket.on('ready', (check: boolean) => {
        setIsReady(check);
      })

      isMounted && socket.on('setPlayer1', (Player:number) => {
        setPlayer1(Player);
      })

      isMounted && socket.on('setPlayer2', (player: number) => {
          setPlayer2(player);
        })

      isMounted && ballSocket.on('setBall', (ballPos: any) => {
        setBallObj(ballPos);
        })

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

      if (canvasSize.width < canvasSize.height)
          var isvertical = true;
      else
          var isvertical = false;
    return <canvas ref={canvasRef} width={isvertical ? canvasSize.width * 1.15 : canvasSize.width} height={isvertical ? canvasSize.height : canvasSize.height * 1.15} />;
}

export default function CanvasGame() {
    const divRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={divRef} className='flex w-full h-full justify-center items-center'>
        {pongFunc(divRef)}
    </div>
  );
}
