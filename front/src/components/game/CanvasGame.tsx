 "use client"
import {RefObject, useEffect, useRef, useState } from "react";
import {io} from 'socket.io-client';
import {Player, Ball, ballSpeed} from 'G_Class/class';
import {check_col, moveBall} from './gameFunc';

var table_obj = {
    player1: new Player(),
    player2: new Player(),
    ball_speed: new ballSpeed(),
    SizeCanvas: ({width:0, height:0}),
    id1: '',
    id2: '',
    ball: new Ball(),
}
// var moveVariable1 = 10;
// var moveVariable2 = 10;
var image1 = "pngavatar.png";
var image2 = "pngavatar2.png";
var backgroundSrc = "background.png";
var lineColor = "#ffff55";
var ballColor = "#ffff55";
var player1Color = "#ffff55";
var player2Color = "#ffff55";
const IPmachine = '10.13.4.16';
var imageLoad = 0;

function draw_line(backgroundCtx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, is_vertical: any) {
    backgroundCtx.strokeStyle = lineColor;
    backgroundCtx.beginPath();
    let x = 0;
    if (is_vertical) {
        backgroundCtx.lineWidth = canvas.width / 1000;
        while (x + 10 <= canvas.width - canvas.width * 0.15) {
            backgroundCtx.moveTo(x, canvas.height / 2);
            backgroundCtx.lineTo(x + 10, canvas.height / 2);
            backgroundCtx.stroke();
            x += 20;
        }
    }
    else {
        backgroundCtx.lineWidth = canvas.height / 1000;
        while (x + 10 <= canvas.height - canvas.height * 0.15) {
            backgroundCtx.moveTo(canvas.width / 2, x);
            backgroundCtx.lineTo(canvas.width / 2, x + 10);
            backgroundCtx.stroke();
            x += 20;
        }
    }
}
function drawBackground(canvas: HTMLCanvasElement | null, background: CanvasImageSource | null) {
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
            background && backgroundCtx.drawImage(background, 0, 0, canvas.width - canvas.width * 0.15, canvas.height);
        }
        else {
            // backgroundCtx.fillRect(0, 0, canvas.width, canvas.height - canvas.height * 0.15);
            background && backgroundCtx.drawImage(background, 0, 0, canvas.width, canvas.height - canvas.height * 0.15);
        }

        draw_line(backgroundCtx, canvas, is_vertical);
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
        ScoreLayer.style.zIndex = '0';
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
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [images, setImages] = useState<{ img1: HTMLImageElement | null, img2: HTMLImageElement | null, background: HTMLImageElement | null }>({
        img1: null,
        img2: null,
        background: null,
      });
    const [Player1, setPlayer1] = useState(0);
    const [Player2, setPlayer2] = useState(0);
    const [BallObj, setBallObj] = useState({
        x: 0,
        y: 0,
    });

    const [canvasSize, SetCanvasSize] = useState({
        width: 0,
        height: 0,
    });

    function StartPause(e: KeyboardEvent) {
        if (e.keyCode == 32) {
          if (Status == true) {
            setStatus(false);
            socket.emit('setStatus', false);
          }
          else {
            setStatus(true);
            socket.emit('setStatus', true);
          }
          console.log(table_obj)
        }
      }

    function keyFunction(e: KeyboardEvent) {
        var position1 = Player1;
        var position2 = Player2;
        if ((e.keyCode == 37 || e.keyCode == 39)) {
            if (e.keyCode == 37){
              if (socket.id == table_obj.id1 && position1 >= 2)
                setPlayer1(position1 - 4)
                // moveVariable1 = position1 - 2;
              else if (socket.id == table_obj.id2 && position2 >= 2)
                setPlayer2(position2 - 4);
                // moveVariable2 = position2 - 2;
            }
            else if (e.keyCode == 39){
              if (socket && socket.id == table_obj.id1 && position1 <= 98)
                setPlayer1(position1 + 4)
                // moveVariable1 = position1 + 2;
              else if (socket.id == table_obj.id2 && position2 <= 98)
                setPlayer2(position2 + 4)
            //   moveVariable2 = position2 + 2;
            }
            // console.log("id1: ", table_obj.id1, "id2: ",table_obj.id2);
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
            playerLayer.style.zIndex = '1';
            canvas.parentNode && canvas.parentNode.insertBefore(playerLayer, canvas);
            playerCtx.beginPath();
            const first = socket.id == table_obj.id1 ? Player1 : Player2;
            if (is_vertical) {
                playerCtx.fillStyle = player1Color;
                playerCtx.fillRect((((canvas.width - canvas.width * 0.25) * first) / 100), canvas.height - ((canvas.height / 150) + canvas.height / 45), canvas.width / 10, canvas.height / 90)
            }
            else {
                playerCtx.fillStyle = player1Color;
                playerCtx.fillRect(canvas.width - ((canvas.width / 150) + canvas.width / 45), ((canvas.height - (canvas.height * 0.25)) * first) / 100, canvas.width / 90, canvas.height / 10)
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
            playerLayer.style.zIndex = '1';
            canvas.parentNode && canvas.parentNode.insertBefore(playerLayer, canvas);
            playerCtx.beginPath();
            const second = socket.id == table_obj.id1 ? Player2 : Player1;
            if (is_vertical) {
                playerCtx.fillStyle = player2Color;
                playerCtx.fillRect((((canvas.width - (canvas.width * 0.25)) * second) / 100), canvas.height / 45, canvas.width / 10, canvas.height / 90)
            }
            else {
                playerCtx.fillStyle = player2Color;
                playerCtx.fillRect(canvas.width / 45, ((canvas.height - (canvas.height * 0.25)) * second) / 100, canvas.width / 90, canvas.height / 10)
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
            
            ballLayer.width = canvas.width;
            ballLayer.height = canvas.height;
            ballLayer.style.position = 'absolute';
            ballLayer.style.zIndex = '2';
            canvas.parentNode && canvas.parentNode.insertBefore(ballLayer, canvas);
            if (ballCtx) {
                ballCtx.beginPath();
                ballCtx.fillStyle = ballColor;
                if (is_vertical)
                ballCtx.arc(((canvas.width - canvas.width * 0.15) * ball.y) / 100, (canvas.height * ball.x) / 100, ball_rad, 0,Math.PI * 2);
                else
                ballCtx.arc((canvas.width * ball.x) / 100, ((canvas.height - canvas.height * 0.15) * ball.y) / 100, ball_rad, 0,Math.PI * 2);
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
        SetCanvasSize({
            width: width,
            height: height,
        })
    }

    useEffect(() => {
        setSocket(io(IPmachine));
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
        setPlayer1(50)
        setPlayer2(50)
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
        const obj = drawBackground(canvas, images.background);
        table_obj.SizeCanvas = canvasSize;
        isMounted && socket.emit('setSize', table_obj.SizeCanvas);
        return () => {
            obj.backgroundCtx && obj.backgroundCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && canvas.parentNode.removeChild(obj.backgroundLayer);
        }
    }, [canvasSize, images])

    // useEffect for Score
    useEffect(() => {
        const obj = drawScore(canvas, images);
        socket && console.log(socket.id, "|>", table_obj.id1, table_obj.id2);
        return () => {
            obj.ScoreCtx && obj.ScoreCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && canvas.parentNode.removeChild(obj.ScoreLayer);
        }
    }, [canvasSize, images]) 

    // useEffect for Player1
    useEffect(() => {
        const obj = Player1Draw(canvas);
        window.addEventListener("keydown", keyFunction);
        // window.addEventListener("mousemove", MouseFunction);
        isMounted &&  socket.emit("setPlayer1", Player1);
        return () => {
            obj && obj.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && obj && canvas.parentNode.removeChild(obj.playerLayer);
              window.removeEventListener("keydown", keyFunction);
            //   window.removeEventListener("mousemove", MouseFunction);
        }
    }, [canvasSize, Player1, Player2])

    // useEffect for Player2
    useEffect(() => {
        const obj = Player2Draw(canvas);

        window.addEventListener("keydown", keyFunction);
        // window.addEventListener("mousemove", MouseFunction);
        isMounted &&  socket.emit("setPlayer2", Player2);

        return () => {
            obj && obj.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && obj && canvas.parentNode.removeChild(obj.playerLayer);
              window.removeEventListener("keydown", keyFunction);
            //   window.removeEventListener("mousemove", MouseFunction);

        }
    }, [canvasSize, Player1, Player2])

    

    // useEffect for ball
    useEffect(() => {
        const obj = drawingBall(canvas, BallObj);

        // if (socket && socket.id === table_obj.id1 && Status) {
        //   intervalRef.current = requestAnimationFrame(() => {
        //     table_obj.ball_speed = check_col(table_obj, BallObj, canvas, table_obj.ball_speed);
        //     var ballPos = moveBall(BallObj, canvas, table_obj.ball_speed);
        //     // console.log(ballPos);
        //     setBallObj(ballPos);
        //     // socket.emit('setBall', ballPos);
        //   });
        // }
        window.addEventListener("keydown", StartPause);
        return () => {
        //   cancelAnimationFrame(intervalRef.current);
          obj.ballCtx && obj.ballCtx.clearRect(0, 0,  canvasSize.width, canvasSize.height);
          canvas?.parentNode && canvas.parentNode.removeChild(obj.ballLayer);
          window.removeEventListener("keydown", StartPause);
        //   // canvas.removeEventListener("mousemove", MouseFunction);
        }
      }, [BallObj, canvasSize, Status])

    useEffect(() => {
            socket && socket.emit('moveBall');
    }, [Status])

      // emit from the server
      isMounted && socket.on('update', (updateObj: any) => {
        table_obj = updateObj;
      })
      isMounted && socket.on('setPlayer1', (player1: number) => {
            setPlayer1(player1);
      })
      isMounted && socket.on('setPlayer2', (player2: number) => {
        setPlayer2(player2);
        })
      isMounted && socket.on('setBall', (ballPos: any) => {
        setBallObj(ballPos);
        })
        // isMounted && socket.on('disconnect', () => {
        //     console.log('disconnect');
        // })
    return <canvas ref={canvasRef} width={canvasSize.width} height={canvasSize.height} />;
}

export default function CanvasGame() {
    const divRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={divRef} className='flex w-full h-full justify-center items-center'>
        {pongFunc(divRef)}
    </div>
  );
}
