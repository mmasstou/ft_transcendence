// export function check_col(
//     tableObj: { player1: { position: number; }; player2: { position: number; }; },
//     BallObj: { y: number; x: number; },
//     canvas: HTMLCanvasElement | null,
//     ball_speed: { x: number; y: number; }) {
//     if (!canvas)
//         return ball_speed
//     var is_vertical = canvas.height > canvas.width ? true : false;
//     var player_width = is_vertical ? (canvas.width / 10) : (canvas.height / 10);
//     var player_height = is_vertical ? (canvas.height / 90) : (canvas.width / 90);
//     var player1 = is_vertical ? ((canvas.width * tableObj.player1.position) / 100) : (canvas.height * tableObj.player1.position) / 100;
//     var player2 = is_vertical ? ((canvas.width * tableObj.player2.position) / 100) : ((canvas.height * tableObj.player2.position) / 100);
//     var ball_x = is_vertical ? ((canvas.width * BallObj.y) / 100) : ((canvas.width * BallObj.x) / 100);
//     var ball_y = is_vertical ? ((canvas.height * BallObj.x) / 100) : (canvas.height * BallObj.y) / 100;
//     var ball_rad = (canvas.width + canvas.height) / 120;


//     if (!is_vertical && ((ball_y + ball_rad) >= canvas.height || ball_y - ball_rad <= 0)) //// colleg with wall H
//         ball_speed.y = -ball_speed.y;
//     else if (is_vertical && (((ball_x + ball_rad) >= canvas.width) || (ball_x - ball_rad) <= 0)) //// colleg with wall V
//         ball_speed.y = -ball_speed.y;
//     // else if (is_vertical && ((ball_y - (ball_rad + player_height + canvas.height / 45)) < 0) && (((ball_x) > player2 && (ball_x < player2 + player_width)))) { //// player 2 V
//     //     ball_speed.x = -ball_speed.x;
//     //     ball_speed.x += ball_speed.x > 0 ? 0.05 : -0.05
//     //     ball_speed.y += ball_speed.y > 0 ? 0.05 : -0.05
//     // }
//     // else if (is_vertical && (ball_y + (ball_rad + player_height + canvas.height / 45) > canvas.height) && ball_x > player1 && ball_x < player1 + player_width) {  ////// player 1 V
//     //     ball_speed.x = -ball_speed.x;
//     //     ball_speed.x += ball_speed.x > 0 ? 0.05 : -0.05
//     //     ball_speed.y += ball_speed.y > 0 ? 0.05 : -0.05
//     // }
//     // else if (!is_vertical && (ball_x - (ball_rad + player_height + canvas.width / 45) < 0) && (ball_y) > player2 && (ball_y < player2 + player_width)) { ////// player 2 H
//     //     ball_speed.x = -ball_speed.x;
//     //     ball_speed.x += ball_speed.x > 0 ? 0.05 : -0.05
//     //     ball_speed.y += ball_speed.y > 0 ? 0.05 : -0.05
//     // }
//     // else if (!is_vertical && (ball_x + (ball_rad + player_height + canvas.width / 45) > canvas.width) && ball_y > player1 && ball_y < player1 + player_width) { //////// player 1 H
//     //     ball_speed.x = -ball_speed.x;
//     //     ball_speed.x += ball_speed.x > 0 ? 0.05 : -0.05
//     //     ball_speed.y += ball_speed.y > 0 ? 0.05 : -0.05
//     // }
//     return ball_speed
// }

// export function moveBall(
//     BallObj: { x: number; y: number; },
//     canvas: HTMLCanvasElement | null,
//     ball_speed: { x: number; y: number; }) {
//         if (!canvas || !ball_speed)
//             return BallObj
//     var is_vertical = canvas.height > canvas.width ? true : false;
//     var ballPos = {
//       x:BallObj.x,
//       y:BallObj.y
//     }
//     if (is_vertical && BallObj.x >= 0 && BallObj.x <= 100 && BallObj.y >= 0 && BallObj.y <= 100) {
//       ballPos.x += ball_speed.x;
//       ballPos.y += ball_speed.y;
//     }
//     else if (!is_vertical && BallObj.x >= 0 && BallObj.x <= 100 && BallObj.y >= 0 && BallObj.y <= 100) {
//       ballPos.x += ball_speed.x;
//       ballPos.y += ball_speed.y;
//     }
//     else {
//       ball_speed.x = -ball_speed.x;
//       ball_speed.y = -ball_speed.y;
//       ball_speed.x -= ball_speed.x > 0.2 ? 0.1 : -0.1
//       ball_speed.y -= ball_speed.y > -0.2 ? 0.1 : -0.1
//       ballPos.x = 50;
//       ballPos.y = 50;
//     }
//     return ballPos;
//   }

interface table_obj {
  player1: any;
  player2: any;
  ball: any;
  Status: boolean;
  tableId: string;
  GameMode: string;
}

function draw_line(
  backgroundCtx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  canvasSize: {width:number, height: number},
  is_vertical: any,
  table_obj: table_obj,
  socket: any)
  {
    const color = socket.auth.UserId === table_obj.player1.UserId ? table_obj.player1.GameSetting.ball : table_obj.player2.GameSetting.ball;
      backgroundCtx.strokeStyle = color;
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

function drawBackground(
  table_obj: table_obj,
  canvas: HTMLCanvasElement | null,
  canvasSize: {width:number, height: number},
  socket: any,) {
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
      const color = socket.auth.UserId === table_obj.player1.UserId ? table_obj.player1.GameSetting.table : table_obj.player2.GameSetting.table;
      const gradient = backgroundCtx.createLinearGradient(0, 0, canvasSize.width, canvasSize.height);
      gradient.addColorStop(0, '#bebebe');
      gradient.addColorStop(0.5, '#878683');
      gradient.addColorStop(1, '#444444');
      backgroundCtx.fillStyle = gradient;
      if (is_vertical) {
          backgroundCtx.fillRect(0, 0, canvasSize.width, canvas.height);
          // background && backgroundCtx.drawImage(background, 0, 0, canvasSize.width, canvasSize.height);
      }
      else {
          backgroundCtx.fillRect(0, 0, canvasSize.width, canvasSize.height);
          // background && backgroundCtx.drawImage(background, 0, 0, canvasSize.width, canvasSize.height);
      }

      draw_line(backgroundCtx, canvas, canvasSize, is_vertical, table_obj, socket);
  }
  return { backgroundCtx, backgroundLayer }
}

function drawScore(
  canvas: HTMLCanvasElement | null,
  images: { img1: CanvasImageSource | null; img2: CanvasImageSource | null;},
  socket?: SocketIOClient.Socket | null,
  table_obj: table_obj
  ){
      const ScoreLayer = document.createElement('canvas');
      const ScoreCtx = ScoreLayer.getContext('2d');
      const is_vertical = canvas && canvas.height > canvas.width ? true : false;
      const first = socket && images.img1 && images.img2 && socket.auth.UserId == table_obj.player1.UserId ? {score: table_obj.player1.score, img: images.img1} : {score: table_obj.player2.score, img: images.img2};
      const second = socket && images.img1 && images.img2 && socket.auth.UserId == table_obj.player1.UserId ? {score: table_obj.player2.score, img: images.img2} : {score: table_obj.player1.score, img: images.img1};
      
    //   console.log("table_obj-->", images.img1, images.img2);
  if (canvas && ScoreCtx) {
      ScoreLayer.width = canvas.width;
      ScoreLayer.height = canvas.height;
      ScoreLayer.style.position = 'absolute';
      ScoreLayer.style.zIndex = '1';
      canvas.parentNode && canvas.parentNode.insertBefore(ScoreLayer, canvas);
      ScoreCtx.beginPath();
      ScoreCtx.fillStyle = "#808080";
      if (is_vertical){
          const str = canvas.width / 25 + "px Arial";
          ScoreCtx && (ScoreCtx.fillStyle = '#fff') && (ScoreCtx.font = str);
          second.img && ScoreCtx.drawImage(second.img, (canvas.width - canvas.width * 0.12), 0, canvas.width * 0.12, canvas.width * 0.12);
          first.img && ScoreCtx.drawImage(first.img, (canvas.width - canvas.width * 0.12), canvas.height - canvas.width * 0.12, canvas.width * 0.12, canvas.width * 0.12);
          ScoreCtx && ScoreCtx.fillText(second.score, canvas.width - (canvas.width * 0.07), canvas.height / 4);
          ScoreCtx && ScoreCtx.fillText(first.score, canvas.width - (canvas.width * 0.07), canvas.height - canvas.height / 4);
      }
      else {
          const str = canvas.width / 25 + "px Arial";
          ScoreCtx && (ScoreCtx.fillStyle = '#fff') && (ScoreCtx.font = str);
          second.img && ScoreCtx.drawImage(second.img,0, canvas.height - (canvas.height * 0.15), canvas.height * 0.14, canvas.height * 0.14);
          first.img && ScoreCtx.drawImage(first.img,canvas.width - (canvas.height * 0.12), canvas.height - canvas.height * 0.12, canvas.height * 0.12, canvas.height * 0.12);
          ScoreCtx && ScoreCtx.fillText(second.score, canvas.width / 4, canvas.height - canvas.height * 0.04);
          ScoreCtx && ScoreCtx.fillText(first.score, canvas.width - canvas.width / 4, canvas.height - canvas.height * 0.04);
      }
  }
  return {ScoreCtx, ScoreLayer};
}


// function StartPause(e: KeyboardEvent, socket: any, Status: boolean) {
//     if (e.keyCode == 32 && Status == false) {
//         socket.emit('setStatus', true);
//     }
//   }

function Player1Draw(canvas: HTMLCanvasElement | null, socket: any, table_obj: table_obj, canvasSize: {width:number, height: number}, player_width: number, Player1: number, Player2: number)
{
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
        const first = socket.auth.UserId == table_obj.player1.UserId ? Player1 : Player2;
        const color = socket.auth.UserId == table_obj.player1.UserId ? table_obj.player1.GameSetting.player : table_obj.player2.GameSetting.player;
        playerCtx.fillStyle = color;
        if (is_vertical) {
            playerCtx.fillRect(((canvasSize.width * first) / 100), canvasSize.height - ((canvasSize.height / 150) + canvasSize.height / 45), canvasSize.width / player_width, canvasSize.height / 90)
        }
        else {
            // playerCtx.fillStyle = player1Color;
            playerCtx.fillRect(canvasSize.width - ((canvasSize.width / 150) + canvasSize.width / 45), (canvasSize.height * first) / 100, canvasSize.width / 90, canvasSize.height / player_width)
        }
        return { playerLayer, playerCtx }
    }
}

function Player2Draw(canvas: HTMLCanvasElement | null, socket: any, table_obj: table_obj, canvasSize: {width:number, height: number}, player_width: number, Player1: number, Player2: number) {
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
        const second = socket.auth.UserId == table_obj.player1.UserId ? Player2 : Player1;
        const color = socket.auth.UserId == table_obj.player1.UserId ? table_obj.player2.GameSetting.player : table_obj.player1.GameSetting.player;
        playerCtx.fillStyle = color;
        // console.log("second: ", color, "player2" , table_obj.player2.GameSetting.player, "player1" ,table_obj.player1.GameSetting.player);
        if (is_vertical) {
            playerCtx.fillRect(((canvasSize.width * second) / 100), canvasSize.height / 45, canvasSize.width / player_width, canvasSize.height / 90)
        }
        else {
            // playerCtx.fillStyle = color;
            playerCtx.fillRect(canvasSize.width / 45, (canvasSize.height * second) / 100, canvasSize.width / 90, canvasSize.height / player_width)
        }
        return { playerLayer, playerCtx }
    }
}

// function MouseFunction(
//     event: { clientX: number; clientY: number; },
//     canvas: HTMLCanvasElement | null,
//     Player1: number,
//     Player2: number,
//     player_width: number,
//     table_obj: table_obj,
//     socket: any,
//     setPlayer1: any,
//     setPlayer2: any,
//     isMounted: boolean,
//     Status: boolean) {
// var updatePlayer;
// var max_variable = 100 - (100 / player_width);
// if (isMounted && canvas && Status) {
//     const rect = canvas.getBoundingClientRect();
//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;
//     if (x >= 0 && y >= 0 && x <= rect.width && y <= rect.height) {
//     var position1 = Player1;
//     var position2 = Player2;
//     var is_vertical = canvas.height > canvas.width ? true : false;
//     if (is_vertical && isMounted && socket.auth.UserId == table_obj.player1.UserId) {
//         updatePlayer = position1 >= 0 && position1 <= max_variable && (x / canvas.width) * 100 <= max_variable && (x / canvas.width) * 100 >= 0 ? Math.round((x / canvas.width) * 100) : position1;
//         if (updatePlayer != position1)
//             setPlayer1(updatePlayer)
//         }
//     else if (is_vertical && isMounted && socket.auth.UserId == table_obj.player2.UserId) {
//         updatePlayer = position2 >= 0 && position2 <= max_variable && (x / canvas.width) * 100 <= max_variable && (x / canvas.width) * 100 >= 0 ? Math.round((x / canvas.width) * 100) : position2;
//         if (updatePlayer != position2)
//         setPlayer2(updatePlayer)
//         }
//     else if (!is_vertical && isMounted && socket.auth.UserId == table_obj.player1.UserId) {
//         updatePlayer = position1 >= 0 && position1 <= max_variable && (y / canvas.height) * 100 <= max_variable && (y / canvas.height) * 100 >= 0 ? Math.round((y / canvas.height) * 100) : position1;
//         if (updatePlayer != position1)
//         setPlayer1(updatePlayer)
//         }
//     else if (!is_vertical && isMounted && socket.auth.UserId == table_obj.player2.UserId) {
//         updatePlayer = position2 >= 0 && position2 <= max_variable && (y / canvas.height) * 100 <= max_variable && (y / canvas.height) * 100 >= 0 ? Math.round((y / canvas.height) * 100) : position2;
//         if (updatePlayer != position2)
//         setPlayer2(updatePlayer)
//         }
//     }
// }
// }

export {drawBackground, drawScore, Player1Draw, Player2Draw}