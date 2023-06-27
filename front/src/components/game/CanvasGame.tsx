"use client"
import { LegacyRef, RefObject, createContext, useContext, useEffect, useRef, useState } from "react";
// import { loadImage } from 'canvas';
import classNames from 'classnames';

var image1 = "AvatarGame.png";
var image2 = "avatarGame2.png";
var imageLoad = 0;

function draw_line(backgroundCtx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, is_vertical: any) {
    backgroundCtx.strokeStyle = "#000000";
    backgroundCtx.beginPath();
    let x = 0;
    if (is_vertical) {
        backgroundCtx.lineWidth = canvas.width / 1000;
        while (x + 10 <= canvas.width - canvas.width * 0.12) {
            backgroundCtx.moveTo(x, canvas.height / 2);
            backgroundCtx.lineTo(x + 10, canvas.height / 2);
            backgroundCtx.stroke();
            x += 20;
        }
    }
    else {
        backgroundCtx.lineWidth = canvas.height / 1000;
        while (x + 10 <= canvas.height - canvas.height * 0.12) {
            backgroundCtx.moveTo(canvas.width / 2, x);
            backgroundCtx.lineTo(canvas.width / 2, x + 10);
            backgroundCtx.stroke();
            x += 20;
        }
    }
}

function drawBackground(canvas: HTMLCanvasElement | null) {
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
        if (is_vertical)
            backgroundCtx.fillRect(0, 0, canvas.width - canvas.width * 0.12, canvas.height);
        else
            backgroundCtx.fillRect(0, 0, canvas.width, canvas.height - canvas.height * 0.12);

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
            const str = canvas.width / 20 + "px Arial";
            ScoreCtx && (ScoreCtx.fillStyle = '#fff') && (ScoreCtx.font = str);
            images.img1 && ScoreCtx.drawImage(images.img1, (canvas.width - canvas.width * 0.12), 0, canvas.width * 0.12, canvas.width * 0.12);
            images.img2 && ScoreCtx.drawImage(images.img2, (canvas.width - canvas.width * 0.12), canvas.height - canvas.width * 0.12, canvas.width * 0.12, canvas.width * 0.12);
            ScoreCtx && ScoreCtx.fillText('15', canvas.width - (canvas.width * 0.07), canvas.height / 4);
            ScoreCtx && ScoreCtx.fillText('3', canvas.width - (canvas.width * 0.07), canvas.height - canvas.height / 4);
        }
        else {
            // ScoreCtx.fillRect(0, canvas.height - (canvas.height * 0.12), canvas.width, canvas.height);
            const str = canvas.width / 20 + "px Arial";
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
    const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
    const [images, setImages] = useState<{ img1: HTMLImageElement | null, img2: HTMLImageElement | null }>({
        img1: null,
        img2: null,
      });
    const [Player1, setPlayer1] = useState(0);
    const [Player2, setPlayer2] = useState(0);
    const [BallObj, setBallObj] = useState({
        x: 50,
        y: 50,
    });

    const [canvasSize, SetCanvasSize] = useState({
        width: 0,
        height: 0,
    });
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
            const first = Player1;
            if (is_vertical) {
                playerCtx.fillStyle = '#000000';
                playerCtx.fillRect((((canvas.width - (canvas.width * 0.15)) * first) / 100), canvas.height - ((canvas.height / 150) + canvas.height / 45), canvas.width / 10, canvas.height / 90)
            }
            else {
                playerCtx.fillStyle = '#000000';
                playerCtx.fillRect(canvas.width - ((canvas.width / 150) + canvas.width / 45), ((canvas.height - (canvas.height * 0.15)) * first) / 100, canvas.width / 90, canvas.height / 10)
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
            const second = Player2;
            if (is_vertical) {
                playerCtx.fillStyle = '#000000';
                playerCtx.fillRect((((canvas.width - (canvas.width * 0.15)) * second) / 100), canvas.height / 45, canvas.width / 10, canvas.height / 90)
            }
            else {
                playerCtx.fillStyle = '#000000';
                playerCtx.fillRect(canvas.width / 45, ((canvas.height - (canvas.height * 0.15)) * second) / 100, canvas.width / 90, canvas.height / 10)
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
            var is_vertical = canvas.height > canvas.width ? true : false;
            
            ballLayer.width = canvas.width;
            ballLayer.height = canvas.height;
            ballLayer.style.position = 'absolute';
            ballLayer.style.zIndex = '2';
            canvas.parentNode && canvas.parentNode.insertBefore(ballLayer, canvas);
            if (ballCtx) {
                ballCtx.beginPath();
                ballCtx.fillStyle = '#000000';
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
            // console.log(sideBarwidth, dashboardRect.width);
        }
        SetCanvasSize({
            width: width,
            height: height,
        })
    }
    useEffect(() => {
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
        img1.onload = checkImageLoaded;
        img2.onload = checkImageLoaded;
        img1.src = image1;
        img2.src = image2;
        handleResize();
        setPlayer1(45)
        setPlayer2(45)
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
        const obj = drawBackground(canvas);
        return () => {
            obj.backgroundCtx && obj.backgroundCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && canvas.parentNode.removeChild(obj.backgroundLayer);
        }
    }, [canvasSize])

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

        // window.addEventListener("keydown", keyFunction);
        // window.addEventListener("mousemove", MouseFunction);
        // isMounted &&  socket.emit("setPlayer1", Player1);
        return () => {
            obj && obj.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && obj && canvas.parentNode.removeChild(obj.playerLayer);
            //   window.removeEventListener("keydown", keyFunction);
            //   window.removeEventListener("mousemove", MouseFunction);
        }
    }, [canvasSize, Player1, Player2])

    // useEffect for Player2
    useEffect(() => {
        const obj = Player2Draw(canvas);

        // window.addEventListener("keydown", keyFunction);
        // window.addEventListener("mousemove", MouseFunction);
        // isMounted &&  socket.emit("setPlayer1", Player1);
        return () => {
            obj && obj.playerCtx.clearRect(0, 0, canvasSize.width, canvasSize.height);
            canvas?.parentNode && obj && canvas.parentNode.removeChild(obj.playerLayer);
            //   window.removeEventListener("keydown", keyFunction);
            //   window.removeEventListener("mousemove", MouseFunction);
        }
    }, [canvasSize, Player1, Player2])

    // useEffect for ball
    useEffect(() => {
        const obj = drawingBall(canvas, BallObj);
        // clearInterval(intervalRef.current);
        // if (socket && socket.id === tableObj.id1 && Status === 'play') {
        //   intervalRef.current = setInterval(() => {
        //     ball_speed = check_col(tableObj, BallObj, canvas, ball_speed);
        //     var ballPos = moveBall(BallObj, canvas, ball_speed);
        //     socket.emit('setBall', ballPos);
        //     setBallObj(ballPos);
        //   },1000 / 10);
        // }
        // window.addEventListener("keydown", StartPause);
        return () => {
          obj.ballCtx && obj.ballCtx.clearRect(0, 0,  canvasSize.width, canvasSize.height);
          canvas?.parentNode && canvas.parentNode.removeChild(obj.ballLayer);
        //   window.removeEventListener("keydown", StartPause);
        //   // canvas.removeEventListener("mousemove", MouseFunction);
        }
      }, [BallObj, canvasSize])

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
