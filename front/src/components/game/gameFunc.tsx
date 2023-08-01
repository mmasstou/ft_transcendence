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
      backgroundCtx.strokeStyle = "#ffffff";
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
      gradient.addColorStop(0.05, color[0]);
    //   gradient.addColorStop(0.5, color[1]);
      gradient.addColorStop(0.85, color[1]);
      backgroundCtx.fillStyle = gradient;
      if (is_vertical)
          backgroundCtx.fillRect(0, 0, canvasSize.width, canvas.height);
      else
          backgroundCtx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      draw_line(backgroundCtx, canvas, canvasSize, is_vertical, table_obj, socket);
  }
  return { backgroundCtx, backgroundLayer }
}

function drawScore(
  canvas: HTMLCanvasElement | null,
  images: { img1: CanvasImageSource | null; img2: CanvasImageSource | null; pause: CanvasImageSource | null},
  Table_obj: table_obj,
  Status: boolean,
  socket?: any,
  ){
      const ScoreLayer = document.createElement('canvas');
      const ScoreCtx = ScoreLayer.getContext('2d');
      const is_vertical = canvas && canvas.height > canvas.width ? true : false;
      const second = socket && images.img1 && images.img2 && socket.auth.UserId == Table_obj.player1.UserId ? {score: Table_obj.player1.score, img: images.img1, color:''} : {score: Table_obj.player2.score, img: images.img2, color:''};
      const first = socket && images.img1 && images.img2 && socket.auth.UserId == Table_obj.player1.UserId ? {score: Table_obj.player2.score, img: images.img2, color:''} : {score: Table_obj.player1.score, img: images.img1, color:''};
      first.score >= second.score ? first.color = '#1EF0AE' : first.color = '#F1453E';
      second.score >= first.score ? second.color = '#1EF0AE' : second.color = '#F1453E';
  if (canvas && ScoreCtx) {
      ScoreLayer.width = canvas.width;
      ScoreLayer.height = canvas.height;
      const radius = is_vertical ? canvas.width * 0.06: canvas.height * 0.06;
      ScoreLayer.style.position = 'absolute';
      ScoreLayer.style.zIndex = '1';
      canvas.parentNode && canvas.parentNode.insertBefore(ScoreLayer, canvas);
      if (is_vertical){
          const str = canvas.width / 20 + "px Arial";
          ScoreCtx && (ScoreCtx.fillStyle = '#fff') && (ScoreCtx.font = str);
          ScoreCtx.beginPath();
          ScoreCtx.arc(canvas.width - radius, radius, radius, 0, Math.PI * 2, true);
          ScoreCtx.arc(canvas.width - radius,canvas.height - radius,radius, 0, Math.PI * 2, true);
          ScoreCtx && (ScoreCtx.fillStyle = second.color) && ScoreCtx.fillText(second.score, canvas.width - (canvas.width * 0.07), canvas.height / 4);
          ScoreCtx && (ScoreCtx.fillStyle = first.color) && ScoreCtx.fillText(first.score, canvas.width - (canvas.width * 0.07), canvas.height - canvas.height / 4);
          ScoreCtx && images.pause && !Status && ScoreCtx.drawImage(images.pause, canvas.width - radius * 2, (canvas.height / 2) - radius, radius * 2, radius * 2);
          ScoreCtx.clip();
          first.img && ScoreCtx.drawImage(first.img, canvas.width - radius * 2, 0, radius * 2, radius * 2);
          second.img && ScoreCtx.drawImage(second.img, (canvas.width - radius * 2), (canvas.height - radius * 2), radius * 2, radius * 2);
      }
      else {
          const str = canvas.height / 20 + "px Arial";
          ScoreCtx && (ScoreCtx.fillStyle = '#fff') && (ScoreCtx.font = str);
          ScoreCtx.beginPath();
          ScoreCtx.arc(radius, (canvas.height - radius), radius, 0, Math.PI * 2, true);
          ScoreCtx.arc(canvas.width - radius, (canvas.height - radius), radius, 0, Math.PI * 2, true);
          ScoreCtx && (ScoreCtx.fillStyle = second.color) && ScoreCtx.fillText(second.score, canvas.width / 4, canvas.height - canvas.height * 0.04);
          ScoreCtx && (ScoreCtx.fillStyle = first.color) && ScoreCtx.fillText(first.score, canvas.width - canvas.width / 4, canvas.height - canvas.height * 0.04);
          ScoreCtx && images.pause && !Status && ScoreCtx.drawImage(images.pause, (canvas.width / 2) - radius, canvas.height - radius * 2, radius * 2, radius * 2);
          ScoreCtx.clip();
          first.img && ScoreCtx.drawImage(first.img, 0, (canvas.height - (radius * 2)), radius * 2, radius * 2);
          second.img && ScoreCtx.drawImage(second.img, canvas.width - radius * 2, (canvas.height - (radius * 2)), radius * 2, radius * 2);
      }
  }
  return {ScoreCtx, ScoreLayer};
}

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
        if (is_vertical)
            playerCtx.fillRect(((canvasSize.width * first) / 100), canvasSize.height - ((canvasSize.height / 150) + canvasSize.height / 45), canvasSize.width / player_width, canvasSize.height / 90)
        else
            playerCtx.fillRect(canvasSize.width - ((canvasSize.width / 150) + canvasSize.width / 45), (canvasSize.height * first) / 100, canvasSize.width / 90, canvasSize.height / player_width)
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
        if (is_vertical)
            playerCtx.fillRect(((canvasSize.width * second) / 100), canvasSize.height / 45, canvasSize.width / player_width, canvasSize.height / 90)
        else
            playerCtx.fillRect(canvasSize.width / 45, (canvasSize.height * second) / 100, canvasSize.width / 90, canvasSize.height / player_width);
        return { playerLayer, playerCtx }
    }
}

function drawingBall(
    canvas: HTMLCanvasElement | null,
    BallObj: { x: number; y: number;},
    socket: any,
    Table_obj: table_obj,
    canvasSize: {width:number, height: number},) {
    const ballLayer = document.createElement('canvas');
    const ballCtx = ballLayer.getContext('2d');
    if (canvas) {
        var ball_rad = (canvas.width + canvas.height) / 120;
        var ball = {
            x:BallObj.x,
            y:BallObj.y,
        }
        if (socket && socket.auth.UserId === Table_obj.player2.UserId)
            ball.x = 100 - ball.x;
        var is_vertical = canvas.height > canvas.width ? true : false;
        ballLayer.width = canvas.width;
        ballLayer.height = canvas.height;
        ballLayer.style.position = 'absolute';
        ballLayer.style.zIndex = '3';
        canvas.parentNode && canvas.parentNode.insertBefore(ballLayer, canvas);
        if (ballCtx) {
            ballCtx.beginPath();
            ballCtx.fillStyle = socket.auth.UserId === Table_obj.player1.UserId ? Table_obj.player1.GameSetting.ball : Table_obj.player2.GameSetting.ball;
            if (is_vertical)
            ballCtx.arc(((canvasSize.width) * ball.y) / 100, (canvasSize.height * ball.x) / 100, ball_rad, 0,Math.PI * 2);
            else
            ballCtx.arc((canvasSize.width * ball.x) / 100, ((canvasSize.height) * ball.y) / 100, ball_rad, 0,Math.PI * 2);
            ballCtx.fill();
        }
    }
    return {ballCtx, ballLayer}
}
export {drawBackground, drawScore, Player1Draw, Player2Draw, drawingBall}