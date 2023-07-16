export function check_col(
    tableObj: { player1: { position: number; }; player2: { position: number; }; },
    BallObj: { y: number; x: number; },
    canvas: HTMLCanvasElement | null,
    ball_speed: { x: number; y: number; }) {
    if (!canvas)
        return ball_speed
    var is_vertical = canvas.height > canvas.width ? true : false;
    var player_width = is_vertical ? (canvas.width / 10) : (canvas.height / 10);
    var player_height = is_vertical ? (canvas.height / 90) : (canvas.width / 90);
    var player1 = is_vertical ? ((canvas.width * tableObj.player1.position) / 100) : (canvas.height * tableObj.player1.position) / 100;
    var player2 = is_vertical ? ((canvas.width * tableObj.player2.position) / 100) : ((canvas.height * tableObj.player2.position) / 100);
    var ball_x = is_vertical ? ((canvas.width * BallObj.y) / 100) : ((canvas.width * BallObj.x) / 100);
    var ball_y = is_vertical ? ((canvas.height * BallObj.x) / 100) : (canvas.height * BallObj.y) / 100;
    var ball_rad = (canvas.width + canvas.height) / 120;


    if (!is_vertical && ((ball_y + ball_rad) >= canvas.height || ball_y - ball_rad <= 0)) //// colleg with wall H
        ball_speed.y = -ball_speed.y;
    else if (is_vertical && (((ball_x + ball_rad) >= canvas.width) || (ball_x - ball_rad) <= 0)) //// colleg with wall V
        ball_speed.y = -ball_speed.y;
    // else if (is_vertical && ((ball_y - (ball_rad + player_height + canvas.height / 45)) < 0) && (((ball_x) > player2 && (ball_x < player2 + player_width)))) { //// player 2 V
    //     ball_speed.x = -ball_speed.x;
    //     ball_speed.x += ball_speed.x > 0 ? 0.05 : -0.05
    //     ball_speed.y += ball_speed.y > 0 ? 0.05 : -0.05
    // }
    // else if (is_vertical && (ball_y + (ball_rad + player_height + canvas.height / 45) > canvas.height) && ball_x > player1 && ball_x < player1 + player_width) {  ////// player 1 V
    //     ball_speed.x = -ball_speed.x;
    //     ball_speed.x += ball_speed.x > 0 ? 0.05 : -0.05
    //     ball_speed.y += ball_speed.y > 0 ? 0.05 : -0.05
    // }
    // else if (!is_vertical && (ball_x - (ball_rad + player_height + canvas.width / 45) < 0) && (ball_y) > player2 && (ball_y < player2 + player_width)) { ////// player 2 H
    //     ball_speed.x = -ball_speed.x;
    //     ball_speed.x += ball_speed.x > 0 ? 0.05 : -0.05
    //     ball_speed.y += ball_speed.y > 0 ? 0.05 : -0.05
    // }
    // else if (!is_vertical && (ball_x + (ball_rad + player_height + canvas.width / 45) > canvas.width) && ball_y > player1 && ball_y < player1 + player_width) { //////// player 1 H
    //     ball_speed.x = -ball_speed.x;
    //     ball_speed.x += ball_speed.x > 0 ? 0.05 : -0.05
    //     ball_speed.y += ball_speed.y > 0 ? 0.05 : -0.05
    // }
    return ball_speed
}

export function moveBall(
    BallObj: { x: number; y: number; },
    canvas: HTMLCanvasElement | null,
    ball_speed: { x: number; y: number; }) {
        if (!canvas || !ball_speed)
            return BallObj
    var is_vertical = canvas.height > canvas.width ? true : false;
    var ballPos = {
      x:BallObj.x,
      y:BallObj.y
    }
    if (is_vertical && BallObj.x >= 0 && BallObj.x <= 100 && BallObj.y >= 0 && BallObj.y <= 100) {
      ballPos.x += ball_speed.x;
      ballPos.y += ball_speed.y;
    }
    else if (!is_vertical && BallObj.x >= 0 && BallObj.x <= 100 && BallObj.y >= 0 && BallObj.y <= 100) {
      ballPos.x += ball_speed.x;
      ballPos.y += ball_speed.y;
    }
    else {
      ball_speed.x = -ball_speed.x;
      ball_speed.y = -ball_speed.y;
      ball_speed.x -= ball_speed.x > 0.2 ? 0.1 : -0.1
      ball_speed.y -= ball_speed.y > -0.2 ? 0.1 : -0.1
      ballPos.x = 50;
      ballPos.y = 50;
    }
    return ballPos;
  }