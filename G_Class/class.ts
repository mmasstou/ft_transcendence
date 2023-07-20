// import exp from "constants";

class Player {
    position: number;
    score: number;
    constructor() {   //////////// max 90%
        this.position = 45,
        this.score = 0
    }
    SetPlayer (position: number) {
        this.position = position
    }
    setScore (score: number) {
        this.score = score
    }
}

class Ball {
    x: number;
    y: number;
    constructor() {
        this.x = 50.0;
        this.y = 50.0;
    }
    setBall(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class ballSpeed {
    x: number;
    y: number;
    constructor() {
        this.x = 0.5;
        this.y = 0.5;
    }
    setBallSpeed(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export {Player, Ball, ballSpeed}