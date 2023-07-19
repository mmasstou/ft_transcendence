 "use client"
import {RefObject, useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client';
import {Player, Ball, ballSpeed} from 'G_Class/class';

var table_obj = {
    player1: new Player(),
    player2: new Player(),
    ball_speed: new ballSpeed(),
    SizeCanvas: ({width:0, height:0}),
    id1: '',
    id2: '',
    ball: new Ball(),
}
var image1 = "pngavatar.png";
var image2 = "pngavatar2.png";
var backgroundSrc = "background.png";
var lineColor = "#ffff55";
var ballColor = "#ffff55";
var player1Color = "#ffff55";
var player2Color = "#ffff55";
const IPmachine = '10.13.1.9';
const IPmachineBall = '10.13.1.9/ball';


/// game settings /// on % of the canvas
var player_width = 6.25;

var imageLoad = 0;

function draw_line(backgroundCtx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, canvasSize: {width:number, height: number}, is_vertical: any) {
    backgroundCtx.strokeStyle = lineColor;
    backgroundCtx.beginPath();
    let x = 0;
    if (is_vertical) {
        backgroundCtx.lineWidth = canvas.width / 1000;
        while (x + 10 <= canvasSize.width) {
            backgroundCtx.moveTo(x, canvas.height / 2);
            backgroundCtx.lineTo(x + 10, canvas.height / 2);
            backgroundCtx.stroke();
            x += 20;
        }
    }
    else {
        backgroundCtx.lineWidth = canvas.height / 1000;
        while (x + 10 <= canvasSize.height) {
            backgroundCtx.moveTo(canvas.width / 2, x);
            backgroundCtx.lineTo(canvas.width / 2, x + 10);
            backgroundCtx.stroke();
            x += 20;
        }
    }
}
function drawBackground(canvas: HTMLCanvasElement | null, canvasSize: {width:number, height: number}, background: CanvasImageSource | null) {
    const backgroundLayer = document.createElement('canvas');
    const backgroundCtx = backgroundLayer.getContext('2d');
    const is_vertical = canvas && canvas.height > canvas.width ? true : false;

    if (canvas && backgroundCtx) {
        backgroundLayer.width = canvas.width;
        backgroundLayer.height = canvas.height;
        backgroundLayer.style.position = 'absolute';
        backgroundLayer.style.zIndex = '0';
        canvas.parentNode && canvas.parentNode.insertBefore(backgroundLayer, canvas);
        backgroundCtx.beginPath();
        backgroundCtx.fillStyle = "#AAD9A5";
        if (is_vertical) {
            // backgroundCtx.fillRect(0, 0, canvas.width - canvas.width * 0.15, canvas.height);
            background && backgroundCtx.drawImage(background, 0, 0, canvasSize.width, canvasSize.height);
        }
        else {
            // backgroundCtx.fillRect(0, 0, canvas.width, canvas.height - canvas.height * 0.15);
            background && backgroundCtx.drawImage(background, 0, 0, canvasSize.width, canvasSize.height);
        }

        draw_line(backgroundCtx, canvas, canvasSize, is_vertical);
    }
    return { backgroundCtx, backgroundLayer }
}

function drawScore(canvas: HTMLCanvasElement | null, images: { img1: CanvasImageSource | null; img2: CanvasImageSource | null; }){
    const ScoreLayer = document.createElement('canvas');
    const ScoreCtx = ScoreLayer.getContext('2d');
    const is_vertical = canvas && canvas.height > canvas.width ? true : false;

    if (canvas && ScoreCtx) {
        ScoreLayer.width = canvas.width;
        ScoreLayer.height = canvas.height;
        ScoreLayer.style.position = 'absolute';
        ScoreLayer.style.zIndex = '1';
        canvas.parentNode && canvas.parentNode.insertBefore(ScoreLayer, canvas);
        ScoreCtx.beginPath();
        ScoreCtx.fillStyle = "#808080";
        if (is_vertical){
            // ScoreCtx.fillRect(canvas.width - canvas.width * 0.12, 0, canvas.width, canvas.height);
            const str = canvas.width / 25 + "px Arial";
            ScoreCtx && (ScoreCtx.fillStyle = '#fff') && (ScoreCtx.font = str);
            images.img1 && ScoreCtx.drawImage(images.img1, (canvas.width - canvas.width * 0.12), 0, canvas.width * 0.12, canvas.width * 0.12);
            images.img2 && ScoreCtx.drawImage(images.img2, (canvas.width - canvas.width * 0.12), canvas.height - canvas.width * 0.12, canvas.width * 0.12, canvas.width * 0.12);
            ScoreCtx && ScoreCtx.fillText('15', canvas.width - (canvas.width * 0.07), canvas.height / 4);
            ScoreCtx && ScoreCtx.fillText('3', canvas.width - (canvas.width * 0.07), canvas.height - canvas.height / 4);
        }
        else {
            // ScoreCtx.fillRect(0, canvas.height - (canvas.height * 0.12), canvas.width, canvas.height);
            const str = canvas.width / 25 + "px Arial";
            ScoreCtx && (ScoreCtx.fillStyle = '#fff') && (ScoreCtx.font = str);
            images.img1 && ScoreCtx.drawImage(images.img1,0, canvas.height - (canvas.height * 0.12), canvas.height * 0.12, canvas.height * 0.12);
            images.img2 && ScoreCtx.drawImage(images.img2,canvas.width - (canvas.height * 0.12), canvas.height - canvas.height * 0.12, canvas.height * 0.12, canvas.height * 0.12);
            ScoreCtx && ScoreCtx.fillText('15', canvas.width / 4, canvas.height - canvas.height * 0.04);
            ScoreCtx && ScoreCtx.fillText('3', canvas.width - canvas.width / 4, canvas.height - canvas.height * 0.04);
        }
    }
    return {ScoreCtx, ScoreLayer};
}


function pongFunc(divRef: RefObject<HTMLDivElement>) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [Status, setStatus] = useState(false);
    const intervalRef = useRef<number>(0);
    const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
    const [ballSocket, setBallSocket] = useState<SocketIOClient.Socket | null>(null);
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [images, setImages] = useState<{ img1: HTMLImageElement | null, img2: HTMLImageElement | null, background: HTMLImageElement | null }>({
        img1: null,
        img2: null,
        background: null,
      });
    const [Player1, setPlayer1] = useState(table_obj.player1.position);
    const [Player2, setPlayer2] = useState(table_obj.player2.position);
    const [BallObj, setBallObj] = useState({
        x: 0,
        y: 0,
    });

    const [canvasSize, SetCanvasSize] = useState({
        width: 0,
        height: 0,
    });

    function StartPause(e: KeyboardEvent) {
        if (e.keyCode == 32 && Status == false) {
            setStatus(true);
            socket.emit('setStatus', true);
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
            if (is_vertical && isMounted && socket.id == table_obj.id1) {
                updatePlayer = position1 >= 0 && position1 <= max_variable && (x / canvas.width) * 100 <= max_variable && (x / canvas.width) * 100 >= 0 ? Math.round((x / canvas.width) * 100) : position1;
                if (updatePlayer != position1)
                    setPlayer1(updatePlayer)
              }
            else if (is_vertical && isMounted && socket.id == table_obj.id2) {
              updatePlayer = position2 >= 0 && position2 <= max_variable && (x / canvas.width) * 100 <= max_variable && (x / canvas.width) * 100 >= 0 ? Math.round((x / canvas.width) * 100) : position2;
              if (updatePlayer != position2)
                setPlayer2(updatePlayer)
              }
            else if (!is_vertical && isMounted && socket.id == table_obj.id1) {
              updatePlayer = position1 >= 0 && position1 <= max_variable && (y / canvas.height) * 100 <= max_variable && (y / canvas.height) * 100 >= 0 ? Math.round((y / canvas.height) * 100) : position1;
              if (updatePlayer != position1)
                setPlayer1(updatePlayer)
              }
            else if (!is_vertical && isMounted && socket.id == table_obj.id2) {
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
              if (socket.id == table_obj.id1 && position1 >= 1) {
                if (position1 >= 3)
                    setPlayer1(position1 - 3)
                else
                    setPlayer1(position1 - 1);
              }
              else if (socket.id == table_obj.id2 && position2 >= 1) {
                if (position2 >= 3)
                    setPlayer2(position2 - 3);
                else
                    setPlayer2(position2 - 1);
              }
            }
            else if (e.keyCode == 39){
              if (socket && socket.id == table_obj.id1 && position1 < max_variable) {
                if (position1 <= max_variable - 3)
                    setPlayer1(position1 + 3)
                else
                    setPlayer1(position1 + 1);
              }
              else if (socket.id == table_obj.id2 && position2 < max_variable)
                if (position2 <= max_variable - 3)
                    setPlayer2(position2 + 3)
                else
                    setPlayer2(position2 + 1);
            }
          }
        }

    function Player1Draw(canvas: HTMLCanvasElement | null) {
        const playerLayer = document.createElement('canvas');
        const playerCtx = playerLayer.getContext('2d');
        if (canvas && playerCtx) {
            var is_vertical = canvas.height > canvas.width ? true : false;
            playerLayer.width = canvas.width;
            playerLayer.height = canvas.height;
            playerLayer.style.position = 'absolute';
            playerLayer.style.zIndex = '2';
            canvas.parentNode && canvas.parentNode.insertBefore(playerLayer, canvas);
            playerCtx.beginPath();
            const first = socket.id == table_obj.id1 ? Player1 : Player2;
            if (is_vertical) {
                playerCtx.fillStyle = player1Color;
                playerCtx.fillRect(((canvasSize.width * first) / 100), canvasSize.height - ((canvasSize.height / 150) + canvasSize.height / 45), canvasSize.width / player_width, canvasSize.height / 90)
            }
            else {
                playerCtx.fillStyle = player1Color;
                playerCtx.fillRect(canvasSize.width - ((canvasSize.width / 150) + canvasSize.width / 45), (canvasSize.height * first) / 100, canvasSize.width / 90, canvasSize.height / player_width)
            }
            return { playerLayer, playerCtx }
        }
    }

    function Player2Draw(canvas: HTMLCanvasElement | null) {
        const playerLayer = document.createElement('canvas');
        const playerCtx = playerLayer.getContext('2d');
        if (canvas && playerCtx) {
            var is_vertical = canvas.height > canvas.width ? true : false;
            playerLayer.width = canvas.width;
            playerLayer.height = canvas.height;
            playerLayer.style.position = 'absolute';
            playerLayer.style.zIndex = '2';
            canvas.parentNode && canvas.parentNode.insertBefore(playerLayer, canvas);
            playerCtx.beginPath();
            const second = socket.id == table_obj.id1 ? Player2 : Player1;
            if (is_vertical) {
                playerCtx.fillStyle = player2Color;
                playerCtx.fillRect(((canvasSize.width * second) / 100), canvasSize.height / 45, canvasSize.width / player_width, canvasSize.height / 90)
            }
            else {
                playerCtx.fillStyle = player2Color;
                playerCtx.fillRect(canvasSize.width / 45, (canvasSize.height * second) / 100, canvasSize.width / 90, canvasSize.height / player_width)
            }
            return { playerLayer, playerCtx }
        }
    }

    function drawingBall(canvas: HTMLCanvasElement | null, BallObj: { x: number; y: number; }) {
        const ballLayer = document.createElement('canvas');
        const ballCtx = ballLayer.getContext('2d');
        if (canvas) {
            var ball_rad = (canvas.width + canvas.height) / 120;
            var ball = {
                x:BallObj.x,
                y:BallObj.y,
            }
            if (socket && socket.id === table_obj.id2)
                ball.x = 100 - ball.x;
            var is_vertical = canvas.height > canvas.width ? true : false;
            console.log("x: ",ball.x, "y: ",ball.y);
            ballLayer.width = canvas.width;
            ballLayer.height = canvas.height;
            ballLayer.style.position = 'absolute';
            ballLayer.style.zIndex = '3';
            canvas.parentNode && canvas.parentNode.insertBefore(ballLayer, canvas);
            if (ballCtx) {
                ballCtx.beginPath();
                ballCtx.fillStyle = ballColor;
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
        isMounted && socket.emit('setStatus', false);
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
        setSocket(io(IPmachine));
        setBallSocket(io(IPmachineBall));
        setIsMounted(true);
        const img1 = new Image();
        const img2 = new Image();
        const background = new Image();
        function checkImageLoaded() {
            imageLoad++;
            if (imageLoad == 3) {
                setImages({
                    img1:img1,
                    img2:img2,
                    background:background,
                })
            }
        }
        img1.onload = checkImageLoaded;
        img2.onload = checkImageLoaded;
        background.onload = checkImageLoaded;
        img1.src = image1;
        img2.src = image2;
        background.src = backgroundSrc;
        handleResize();
        setBallObj({
            x:table_obj.ball.x,
            y:table_obj.ball.y,
        })
        if (canvasRef.current) {
            setCanvas(canvasRef.current);
        }
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, [])

    // useEffect for background
    useEffect(() => {
        if (socket && socket.id === table_obj.id1)
            table_obj.SizeCanvas = canvasSize;
        const obj = drawBackground(canvas, canvasSize, images.background);
        isMounted && socket.emit('setSize', table_obj.SizeCanvas);
        isMounted && socket.emit('setStatus', false);
        isMounted && socket.emit('getData');
        window.addEventListener("resize", handleResize);
        return () => {
            obj.backgroundCtx && obj.backgroundCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && canvas.parentNode.removeChild(obj.backgroundLayer);
            window.removeEventListener("resize", handleResize);
        }
    }, [canvasSize, images])

    // useEffect for Score
    useEffect(() => {
        const obj = drawScore(canvas, images);
        return () => {
            obj.ScoreCtx && obj.ScoreCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && canvas.parentNode.removeChild(obj.ScoreLayer);
        }
    }, [canvasSize, images]) 

    // useEffect for Player1
    useEffect(() => {
        const obj = Player1Draw(canvas);
        window.addEventListener("keydown", keyFunction);
        window.addEventListener("mousemove", MouseFunction);
        isMounted && socket.id === table_obj.id1  && socket.emit("setPlayer1", Player1);
        return () => {
            obj && obj.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && obj && canvas.parentNode.removeChild(obj.playerLayer);
              window.removeEventListener("keydown", keyFunction);
              window.removeEventListener("mousemove", MouseFunction);
        }
    }, [canvasSize, Player1, Player2, Status])


    // useEffect for Player2
    useEffect(() => {
        const obj = Player2Draw(canvas);
        window.addEventListener("keydown", keyFunction);
        window.addEventListener("mousemove", MouseFunction);
        isMounted && socket.id === table_obj.id2  && socket.emit("setPlayer2", Player2);

        return () => {
            obj && obj.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && obj && canvas.parentNode.removeChild(obj.playerLayer);
              window.removeEventListener("keydown", keyFunction);
              window.removeEventListener("mousemove", MouseFunction);

        }
    }, [canvasSize, Player1, Player2, Status])

    

    // useEffect for ball
    useEffect(() => {
        const obj = drawingBall(canvas, BallObj);
        window.addEventListener("keydown", StartPause);
        return () => {
          obj.ballCtx && obj.ballCtx.clearRect(0, 0,  canvasSize.width, canvasSize.height);
          canvas?.parentNode && canvas.parentNode.removeChild(obj.ballLayer);
          window.removeEventListener("keydown", StartPause);
        }
      }, [BallObj, canvasSize, Status])

    useEffect(() => {
            ballSocket && ballSocket.emit('moveBall');
    }, [Status])

      // emit from the server
      isMounted && socket.on('update', (updateObj: any) => {
        table_obj = updateObj;
      })
      isMounted && socket.on('setPlayer1', (player1: number) => {
        if (socket.id === table_obj.id2)
            setPlayer1(player1);
      })
      isMounted && socket.on('setPlayer2', (player2: number) => {
        if (socket.id === table_obj.id1)
            setPlayer2(player2);
        })
      isMounted && socket.on('getData', (data: any) => {
        if (data) {
            setPlayer1(data.player1.position);
            setPlayer2(data.player2.position);
            setBallObj(data.ball);
        }
      })
      isMounted && ballSocket  .on('setBall', (ballPos: any) => {
        setBallObj(ballPos);
        })
        // isMounted && socket.on('disconnect', () => {
        //     console.log('disconnect');
        // })
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
