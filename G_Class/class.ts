// import exp from "constants";

class Player {
    position: number;
    constructor() {   //////////// max 90%
        this.position = 45
    }
    SetPlayer (position: number) {
        this.position = position
    }
}

class Ball {
    x: number;
    y: number;
    constructor() {
        this.x = 50.0;
        this.y = 70.0;
    }
    setBall(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export {Player, Ball}