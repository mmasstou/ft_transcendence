 "use client"
import {RefObject, useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client';
import {Player, Ball, ballSpeed, TableMap} from 'G_Class/class';
import Cookies from "js-cookie";
import LoginHook from '@/hooks/auth/login';
import {drawBackground, drawScore, Player1Draw, Player2Draw} from './gameFunc';

var table_obj = {
    player1: new Player(),
    player2: new Player(),
    ball: new Ball(),
    Status: false,
    tableId: '',
    GameMode: '',
}
const IPmachine = '10.13.1.1/game';
const IPmachineBall = '10.13.1.1/ball';

const TableMap: TableMap = new Map();

/// game settings /// on % of the canvas
var player_width = 6.25;
var imageLoad = 0;


// function draw_line(
//   backgroundCtx: CanvasRenderingContext2D,
//   canvas: HTMLCanvasElement,
//   canvasSize: {width:number, height: number},
//   is_vertical: any,
//   table_obj: table_obj,
//   socket: any)
//   {
//     const color = socket.auth.UserId === table_obj.player1.UserId ? table_obj.player1.GameSetting.ball : table_obj.player2.GameSetting.ball;
//       backgroundCtx.strokeStyle = color;
//       backgroundCtx.beginPath();
//       let x = 0;
//       if (is_vertical) {
//           backgroundCtx.lineWidth = canvas.width / 1000;
//           while (x + 10 <= canvasSize.width) {
//               backgroundCtx.moveTo(x, canvas.height / 2);
//               backgroundCtx.lineTo(x + 10, canvas.height / 2);
//               backgroundCtx.stroke();
//               x += 20;
//           }
//       }
//       else {
//           backgroundCtx.lineWidth = canvas.height / 1000;
//           while (x + 10 <= canvasSize.height) {
//               backgroundCtx.moveTo(canvas.width / 2, x);
//               backgroundCtx.lineTo(canvas.width / 2, x + 10);
//               backgroundCtx.stroke();
//               x += 20;
//           }
//       }
// }
// function drawBackground(
//   table_obj: any,
//   canvas: HTMLCanvasElement | null,
//   canvasSize: {width:number, height: number},
//   socket: any,) {
//   const backgroundLayer = document.createElement('canvas');
//   const backgroundCtx = backgroundLayer.getContext('2d');
//   const is_vertical = canvas && canvas.height > canvas.width ? true : false;

//   if (canvas && backgroundCtx) {
//       backgroundLayer.width = canvas.width;
//       backgroundLayer.height = canvas.height;
//       backgroundLayer.style.position = 'absolute';
//       backgroundLayer.style.zIndex = '0';
//       canvas.parentNode && canvas.parentNode.insertBefore(backgroundLayer, canvas);
//       backgroundCtx.beginPath();
//       const color = socket.auth.UserId === table_obj.player1.UserId ? table_obj.player1.GameSetting.table : table_obj.player2.GameSetting.table;
//       const gradient = backgroundCtx.createLinearGradient(0, 0, canvasSize.width, canvasSize.height);
//       gradient.addColorStop(0, '#D16BA5');
//       gradient.addColorStop(0.5, '#86A8E7');
//       gradient.addColorStop(1, '#5FFBF1');
//       backgroundCtx.fillStyle = gradient;
//       if (is_vertical) {
//           backgroundCtx.fillRect(0, 0, canvasSize.width, canvas.height);
//           // background && backgroundCtx.drawImage(background, 0, 0, canvasSize.width, canvasSize.height);
//       }
//       else {
//           backgroundCtx.fillRect(0, 0, canvasSize.width, canvasSize.height);
//           // background && backgroundCtx.drawImage(background, 0, 0, canvasSize.width, canvasSize.height);
//       }

//       draw_line(backgroundCtx, canvas, canvasSize, is_vertical, table_obj, socket);
//   }
//   return { backgroundCtx, backgroundLayer }
// }

// function drawScore(
//   canvas: HTMLCanvasElement | null,
//   images: { img1: CanvasImageSource | null; img2: CanvasImageSource | null;},
//   socket?: SocketIOClient.Socket | null,
//   table_obj: any
//   ){
//       const ScoreLayer = document.createElement('canvas');
//       const ScoreCtx = ScoreLayer.getContext('2d');
//       const is_vertical = canvas && canvas.height > canvas.width ? true : false;
//       const first = socket && images.img1 && images.img2 && socket.auth.UserId == table_obj.player1.UserId ? {score: table_obj.player1.score, img: images.img1} : {score: table_obj.player2.score, img: images.img2};
//       const second = socket && images.img1 && images.img2 && socket.auth.UserId == table_obj.player1.UserId ? {score: table_obj.player2.score, img: images.img2} : {score: table_obj.player1.score, img: images.img1};
      
//     //   console.log("table_obj-->", images.img1, images.img2);
//   if (canvas && ScoreCtx) {
//       ScoreLayer.width = canvas.width;
//       ScoreLayer.height = canvas.height;
//       ScoreLayer.style.position = 'absolute';
//       ScoreLayer.style.zIndex = '1';
//       canvas.parentNode && canvas.parentNode.insertBefore(ScoreLayer, canvas);
//       ScoreCtx.beginPath();
//       ScoreCtx.fillStyle = "#808080";
//       if (is_vertical){
//           const str = canvas.width / 25 + "px Arial";
//           ScoreCtx && (ScoreCtx.fillStyle = '#fff') && (ScoreCtx.font = str);
//           first.img && ScoreCtx.drawImage(first.img, (canvas.width - canvas.width * 0.12), 0, canvas.width * 0.12, canvas.width * 0.12);
//           second.img && ScoreCtx.drawImage(second.img, (canvas.width - canvas.width * 0.12), canvas.height - canvas.width * 0.12, canvas.width * 0.12, canvas.width * 0.12);
//           ScoreCtx && ScoreCtx.fillText(first.score, canvas.width - (canvas.width * 0.07), canvas.height / 4);
//           ScoreCtx && ScoreCtx.fillText(second.score, canvas.width - (canvas.width * 0.07), canvas.height - canvas.height / 4);
//       }
//       else {
//           const str = canvas.width / 25 + "px Arial";
//           ScoreCtx && (ScoreCtx.fillStyle = '#fff') && (ScoreCtx.font = str);
//           first.img && ScoreCtx.drawImage(first.img,0, canvas.height - (canvas.height * 0.15), canvas.height * 0.14, canvas.height * 0.14);
//           second.img && ScoreCtx.drawImage(second.img,canvas.width - (canvas.height * 0.12), canvas.height - canvas.height * 0.12, canvas.height * 0.12, canvas.height * 0.12);
//           ScoreCtx && ScoreCtx.fillText(first.score, canvas.width / 4, canvas.height - canvas.height * 0.04);
//           ScoreCtx && ScoreCtx.fillText(second.score, canvas.width - canvas.width / 4, canvas.height - canvas.height * 0.04);
//       }
//   }
//   return {ScoreCtx, ScoreLayer};
// }



function pongFunc(divRef: RefObject<HTMLDivElement>) {
    const  canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [Status, setStatus] = useState(false);
    const [socket, setSocket] = useState<any>(null);
    const [ballSocket, setBallSocket] = useState<any>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [images, setImages] = useState<{ img1: HTMLImageElement | null, img2: HTMLImageElement | null}>({
        img1: null,
        img2: null,
      });
    const [Player1, setPlayer1] = useState(table_obj.player1.position);
    const [Player2, setPlayer2] = useState(table_obj.player2.position);
    const [BallObj, setBallObj] = useState({
        x: 0,
        y: 0,
    });
    const [Score, setScore] = useState({first: table_obj.player1.score, second: table_obj.player2.score});
    const [canvasSize, SetCanvasSize] = useState({
        width: 0,
        height: 0,
    });
    // const [GetImage, setGetImage] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const loginhook = LoginHook();
    const Token = Cookies.get('token');

    function StartPause(e: KeyboardEvent) {
        if (e.keyCode == 32 && Status == false) {
            socket.emit('setStatus', {status:true, tableId: table_obj.tableId});
        }
      }

      function MouseFunction(event: { clientX: number; clientY: number; }) {
        var updatePlayer;
        var max_variable = 100 - (100 / player_width);
        if (isMounted && canvas && Status) {
          const rect = canvas.getBoundingClientRect();
          const x = event.clientX - rect.left;
          const y = event.clientY - rect.top;
          if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
            var position1 = Player1;
            var position2 = Player2;
            var is_vertical = canvas.height > canvas.width ? true : false;
            if (is_vertical && isMounted && socket.auth.UserId == table_obj.player1.UserId) {
                updatePlayer = position1 >= 0 && position1 <= max_variable && (x / canvas.width) * 100 <= max_variable && (x / canvas.width) * 100 >= 0 ? Math.round((x / canvas.width) * 100) : position1;
                if (updatePlayer != position1)
                    setPlayer1(updatePlayer)
              }
            else if (is_vertical && isMounted && socket.auth.UserId == table_obj.player2.UserId) {
              updatePlayer = position2 >= 0 && position2 <= max_variable && (x / canvas.width) * 100 <= max_variable && (x / canvas.width) * 100 >= 0 ? Math.round((x / canvas.width) * 100) : position2;
              if (updatePlayer != position2)
                setPlayer2(updatePlayer)
              }
            else if (!is_vertical && isMounted && socket.auth.UserId == table_obj.player1.UserId) {
              updatePlayer = position1 >= 0 && position1 <= max_variable && (y / canvas.height) * 100 <= max_variable && (y / canvas.height) * 100 >= 0 ? Math.round((y / canvas.height) * 100) : position1;
              if (updatePlayer != position1)
                setPlayer1(updatePlayer)
              }
            else if (!is_vertical && isMounted && socket.auth.UserId == table_obj.player2.UserId) {
              updatePlayer = position2 >= 0 && position2 <= max_variable && (y / canvas.height) * 100 <= max_variable && (y / canvas.height) * 100 >= 0 ? Math.round((y / canvas.height) * 100) : position2;
              if (updatePlayer != position2)
                setPlayer2(updatePlayer)
              }
          }
        }
      }


    function keyFunction(e: KeyboardEvent) {
        var position1 = Player1;
        var position2 = Player2;
        var max_variable = 100 - (100 / player_width);
        if ((e.keyCode == 37 || e.keyCode == 39) && Status) {
            if (e.keyCode == 37){
              if (socket.auth.UserId == table_obj.player1.UserId && position1 >= 1) {
                if (position1 >= 3)
                    setPlayer1(position1 - 3)
                else
                    setPlayer1(position1 - 1);
              }
              else if (socket.auth.UserId == table_obj.player2.UserId && position2 >= 1) {
                if (position2 >= 3)
                    setPlayer2(position2 - 3);
                else
                    setPlayer2(position2 - 1);
              }
            }
            else if (e.keyCode == 39){
              if (socket && socket.auth.UserId == table_obj.player1.UserId && position1 < max_variable) {
                if (position1 <= max_variable - 3)
                    setPlayer1(position1 + 3)
                else
                    setPlayer1(position1 + 1);
              }
              else if (socket.auth.UserId == table_obj.player2.UserId && position2 < max_variable)
                if (position2 <= max_variable - 3)
                    setPlayer2(position2 + 3)
                else
                    setPlayer2(position2 + 1);
            }
          }
        }

    // function Player1Draw(canvas: HTMLCanvasElement | null) {
    //     const playerLayer = document.createElement('canvas');
    //     const playerCtx = playerLayer.getContext('2d');
    //     if (canvas && playerCtx) {
    //         var is_vertical = canvas.height > canvas.width ? true : false;
    //         playerLayer.width = canvas.width;
    //         playerLayer.height = canvas.height;
    //         playerLayer.style.position = 'absolute';
    //         playerLayer.style.zIndex = '2';
    //         canvas.parentNode && canvas.parentNode.insertBefore(playerLayer, canvas);
    //         playerCtx.beginPath();
    //         const first = socket.auth.UserId == table_obj.player1.UserId ? Player1 : Player2;
    //         const color = socket.auth.UserId == table_obj.player1.UserId ? table_obj.player1.GameSetting.player : table_obj.player2.GameSetting.player;
    //         playerCtx.fillStyle = color;
    //         if (is_vertical) {
    //             playerCtx.fillRect(((canvasSize.width * first) / 100), canvasSize.height - ((canvasSize.height / 150) + canvasSize.height / 45), canvasSize.width / player_width, canvasSize.height / 90)
    //         }
    //         else {
    //             // playerCtx.fillStyle = player1Color;
    //             playerCtx.fillRect(canvasSize.width - ((canvasSize.width / 150) + canvasSize.width / 45), (canvasSize.height * first) / 100, canvasSize.width / 90, canvasSize.height / player_width)
    //         }
    //         return { playerLayer, playerCtx }
    //     }
    // }

    // function Player2Draw(canvas: HTMLCanvasElement | null) {
    //     const playerLayer = document.createElement('canvas');
    //     const playerCtx = playerLayer.getContext('2d');
    //     if (canvas && playerCtx) {
    //         var is_vertical = canvas.height > canvas.width ? true : false;
    //         playerLayer.width = canvas.width;
    //         playerLayer.height = canvas.height;
    //         playerLayer.style.position = 'absolute';
    //         playerLayer.style.zIndex = '2';
    //         canvas.parentNode && canvas.parentNode.insertBefore(playerLayer, canvas);
    //         playerCtx.beginPath();
    //         const second = socket.auth.UserId == table_obj.player1.UserId ? Player2 : Player1;
    //         const color = socket.auth.UserId == table_obj.player1.UserId ? table_obj.player2.GameSetting.player : table_obj.player1.GameSetting.player;
    //         playerCtx.fillStyle = color;
    //         // console.log("second: ", color, "player2" , table_obj.player2.GameSetting.player, "player1" ,table_obj.player1.GameSetting.player);
    //         if (is_vertical) {
    //             playerCtx.fillRect(((canvasSize.width * second) / 100), canvasSize.height / 45, canvasSize.width / player_width, canvasSize.height / 90)
    //         }
    //         else {
    //             // playerCtx.fillStyle = color;
    //             playerCtx.fillRect(canvasSize.width / 45, (canvasSize.height * second) / 100, canvasSize.width / 90, canvasSize.height / player_width)
    //         }
    //         return { playerLayer, playerCtx }
    //     }
    // }

    function drawingBall(canvas: HTMLCanvasElement | null, BallObj: { x: number; y: number; }) {
        const ballLayer = document.createElement('canvas');
        const ballCtx = ballLayer.getContext('2d');
        if (canvas) {
            var ball_rad = (canvas.width + canvas.height) / 120;
            var ball = {
                x:BallObj.x,
                y:BallObj.y,
            }
            if (socket && socket.auth.UserId === table_obj.player2.UserId)
                ball.x = 100 - ball.x;
            var is_vertical = canvas.height > canvas.width ? true : false;
            ballLayer.width = canvas.width;
            ballLayer.height = canvas.height;
            ballLayer.style.position = 'absolute';
            ballLayer.style.zIndex = '3';
            canvas.parentNode && canvas.parentNode.insertBefore(ballLayer, canvas);
            if (ballCtx) {
                ballCtx.beginPath();
                ballCtx.fillStyle = socket.auth.UserId === table_obj.player1.UserId ? table_obj.player1.GameSetting.ball : table_obj.player2.GameSetting.ball;
                if (is_vertical)
                ballCtx.arc(((canvasSize.width) * ball.y) / 100, (canvasSize.height * ball.x) / 100, ball_rad, 0,Math.PI * 2);
                else
                ballCtx.arc((canvasSize.width * ball.x) / 100, ((canvasSize.height) * ball.y) / 100, ball_rad, 0,Math.PI * 2);
                ballCtx.fill();
            }
        }
        return {ballCtx, ballLayer}
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
        setStatus(false);
        isMounted && socket.emit('setStatus', {status:false, tableId: table_obj.tableId});
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
    
    useEffect(() => {
        if (!Cookies.get('token'))
            loginhook.onOpen();
    }, [])

    useEffect(() => {
      if (!isReady)
        return;
    // console.log("get image---------", table_obj.player1.avatar, table_obj.player2.avatar);
    const img1 = new Image();
    const img2 = new Image();
    function checkImageLoaded() {
        imageLoad++;
        if (imageLoad == 2) {
          // console.log("image loaded");
            setImages({
                img1:img1,
                img2:img2,
            })
        }
    }
    // console.log("table_obj image path-->", table_obj.player1.GameSetting.avatar)
    img1.src = table_obj.player1.GameSetting.avatar;
    img2.src = table_obj.player2.GameSetting.avatar;
    // console.log("table_obj-->", table_obj.player1.GameSetting.avatar, table_obj.player2.GameSetting.avatar)
    // img1.src = "pngavatar.png";
    // img2.src = "pngavatar2.png";
    img1.onload = checkImageLoaded;
    img2.onload = checkImageLoaded;
    // console.log("create socket");
    // if (!Cookies.get('token'))
    //   return;
    // setSocket(io(IPmachine, {auth: {token: Cookies.get('token'), UserId: Cookies.get('_id'), Username: Cookies.get('username')}}));
    // setBallSocket(io(IPmachineBall ,{auth: {token: Cookies.get('token'), UserId: Cookies.get('_id'), Username: Cookies.get('username')}}));
    // setIsMounted(true);
    // background.src = backgroundSrc;
    handleResize();
    setBallObj({
        x:table_obj.ball.x,
        y:table_obj.ball.y,
    })
    // console.log('before: ', Player1, Player2, table_obj.player1.position, table_obj.player2.position)
    setPlayer1(table_obj.player1.position);
    setPlayer2(table_obj.player2.position);
    // console.log('after: ', Player1, Player2, table_obj.player1.position, table_obj.player2.position)
    if (canvasRef.current) {
        setCanvas(canvasRef.current);
    }
    window.addEventListener("resize", handleResize);
    
    return () => {
        window.removeEventListener("resize", handleResize);
    }
    }, [isReady])

    useEffect(() => {
      if (!Cookies.get('token'))
        return;
      setSocket(io(IPmachine, {auth: {token: Cookies.get('token'), UserId: Cookies.get('_id'), Username: Cookies.get('username'), tableId: Cookies.get('tableId')}}));
      setBallSocket(io(IPmachineBall ,{auth: {token: Cookies.get('token'), UserId: Cookies.get('_id'), Username: Cookies.get('username'), tableId: Cookies.get('tableId')}}));
      setIsMounted(true);
    }, [Token]);

    // useEffect for background
    useEffect(() => {
        // if (socket && socket.id === table_obj.id1)
        //     table_obj.SizeCanvas = canvasSize;
        // if (socket && socket.auth.UserId === table_obj.player1.UserId)

        if (isReady) {
          if (!Cookies.get('tableId'))
            Cookies.set('tableId', table_obj.tableId);
          const obj = drawBackground(table_obj, canvas, canvasSize, socket);
          // isMounted && socket.emit('setSize', table_obj.SizeCanvas);
          // isMounted && socket.emit('setStatus', false);
          // isMounted && socket.emit('getData');
          setScore({first: table_obj.player1.score, second: table_obj.player2.score});
          // console.log("table_obj-->", table_obj);
          window.addEventListener("resize", handleResize);
          // console.log("background", table_obj);
          return () => {
              obj.backgroundCtx && obj.backgroundCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
              canvas?.parentNode && canvas.parentNode.removeChild(obj.backgroundLayer);
              window.removeEventListener("resize", handleResize);
          }
        }
            
    }, [canvasSize, images, isReady])

    // useEffect for Score
    useEffect(() => {
        // if (!isReady) {
          // console.log("Score", images);
            const obj = drawScore(canvas, images, socket, table_obj);
            return () => {
                obj.ScoreCtx && obj.ScoreCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
                canvas?.parentNode && canvas.parentNode.removeChild(obj.ScoreLayer);
            }
        // }
    }, [canvasSize, images, Score, Status, isReady]) 

    // useEffect for Player
    useEffect(() => {
        if (isReady) {
            const obj1 = Player1Draw(canvas, socket, table_obj, canvasSize, player_width, Player1, Player2);
            const obj2 = Player2Draw(canvas, socket, table_obj, canvasSize, player_width, Player1, Player2);
            window.addEventListener("keydown", keyFunction);
            window.addEventListener("mousemove", MouseFunction)
            window.addEventListener("keydown", StartPause)
            isMounted && socket.auth.UserId === table_obj.player1.UserId  && socket.emit("setPlayer1", {Player: Player1, tableId: table_obj.tableId});
            isMounted && socket.auth.UserId === table_obj.player2.UserId  && socket.emit("setPlayer2", {Player: Player2, tableId: table_obj.tableId});
            return () => {
                obj1 && obj1.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
                canvas?.parentNode && obj1 && canvas.parentNode.removeChild(obj1.playerLayer);
                obj2 && obj2.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
                canvas?.parentNode && obj2 && canvas.parentNode.removeChild(obj2.playerLayer);
                  window.removeEventListener("keydown", keyFunction);
                  window.removeEventListener("mousemove", MouseFunction)
                  window.removeEventListener("keydown", StartPause)
            }
        }
    }, [canvasSize, Player1, Player2, Status])

    // useEffect for ball
    useEffect(() => {
        if (isReady) {
            const obj = drawingBall(canvas, BallObj);
            console.log("ball", BallObj, table_obj.tableId);
            // console.log("ball--------------", BallObj, "------", table_obj.player2.UserId);
            table_obj.player2.UserId == 'Bot' && BallObj.y > 8 && BallObj.y < 92 && socket.emit("setBot", {Player: BallObj.y - 8, tableId: table_obj.tableId}) && setPlayer2(BallObj.y - 8);   /////////////// bot /////////////// need more calculation
            // table_obj.player2.userId = 'bot' && console.log("bot", table_obj.player2);
            // console.log("bot", table_obj.player2);
            return () => {
              obj.ballCtx && obj.ballCtx.clearRect(0, 0,  canvasSize.width, canvasSize.height);
              canvas?.parentNode && canvas.parentNode.removeChild(obj.ballLayer);
            }
        }
      }, [BallObj, canvasSize, isReady])

    // useEffect for emit the status to the server
    useEffect(() => {
      console.log("Status", table_obj.tableId);
            ballSocket && isReady &&  ballSocket.emit('moveBall', table_obj.tableId);
    }, [Status])

      ////////////////////// emit from the server ///////////////////////

      isMounted && socket.on('joinRoomGame', (table: any) => {
        // console.log("joinRoomGame------------!!!!!!!!!!", table);
        // console.log("joinRoomGame", table);
        setIsReady(false);
        TableMap.set(table.tableId, table);
        // table_obj = table;
        socket.emit('joinToRoomGame', table.tableId);
      })

      isMounted && ballSocket.on('joinRoomBall', (table: any) => {
        // console.log("joinRoomBall------------!!!!!!!!!!", table);
        ballSocket.emit('joinToRoomBall', table.tableId);
      })

      isMounted && socket.on('ready', (check: boolean) => {
        // console.log("ready", table_obj);
        setIsReady(check);
      })


      // isMounted && socket.on('update', (updateObj: any) => {
      //   table_obj = updateObj;
      // })

      isMounted && socket.on('setPlayer1', (player: number, tableId: string) => {
        console.log("setPlayer1-------", player, tableId);
        // if (socket.auth.UserId === table_obj.player2.UserId)
        //     setPlayer1(player1);
      })

      isMounted && socket.on('setPlayer2', (player2: number) => {
        if (socket.auth.UserId === table_obj.player1.UserId)
            setPlayer2(player2);
        })

      // isMounted && socket.on('getData', (table_obj: any) => {
      //   if (table_obj) {
      //       setPlayer1(table_obj.player1.position);
      //       setPlayer2(table_obj.player2.position);
      //       setBallObj(table_obj.ball);
      //   }
      // })

      isMounted && ballSocket.on('setBall', (ballPos: any) => {
        // console.log("setBall-------", ballPos);
        setBallObj(ballPos);
        })
      isMounted && socket.on('setStatus', (status: boolean) => {
        // console.log("setStatus-------", table_obj);
        setStatus(status);
        })
      isMounted && ballSocket && ballSocket.on('setScore1', (score: number) => {
        table_obj.player1.score = score;
        setScore({first: score, second: table_obj.player2.score});
      })
      // isMounted && socket.on('image', (check: boolean) => {
      //   setGetImage(check);
      // })
      
        isMounted && ballSocket && ballSocket.on('setScore2', (score: number) => {
        table_obj.player2.score = score;
        setScore({first: table_obj.player1.score, second: score});
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
