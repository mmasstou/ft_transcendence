type User = {
    id: string
    login: string
    email: string
    password: string | null
    first_name: string | null
    last_name: string | null
    kind: string | null
    image: string | null
    bg_color: string[] | null
    paddle_color: string | null
    ball_color: string | null
    is_active: boolean
    created_at: Date
    updated_at: Date
  }

type table_obj = {
    player1: Player
    player2: Player
    ball: Ball
    Status: boolean
    current: any
    tableId: string
    GameMode: string
  }

type Random_Obj = {
    player: Player
    GameMode: string
}
class GameSetting {
    table: string[];
    ball: string;
    player: string;
    avatar: string;
    constructor() {
        this.table = [];
        this.ball = '#ffffff';
        this.player = '#ffffff';
        this.avatar = '';
    }
    setData(table: string[], ball: string, player: string, avatar: string) {
        this.table = table;
        this.ball = ball;
        this.player = player;
        this.avatar = avatar;
    }
}

class Player {
    UserId: string;
    position: number;
    score: number;
    GameSetting: GameSetting;
    constructor() {   //////////// max 90%
        this.UserId = '',
        this.position = 45,
        this.score = 0,
        this.GameSetting = new GameSetting()
        
    }
    SetPlayer (position: number) {
        this.position = position
    }
    setScore (score: number) {
        this.score = score
    }
    setUserId (UserId: string) {
        this.UserId = UserId
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

class Ball {
    x: number;
    y: number;
    ball_speed: ballSpeed;
    ballIcrement: number;
    constructor() {
        this.x = 50.0,
        this.y = 50.0,
        this.ball_speed = new ballSpeed()
        this.ballIcrement = 0.2;
    }
    setBall(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class UniqueSet {
    set: Set<string>;
    array: Random_Obj[];
    constructor() {
      this.set = new Set();
      this.array = [];
    }
  
    add(obj: Random_Obj) {
      if (!this.set.has(obj.player.UserId)) {
        this.set.add(obj.player.UserId);
        this.array.push(obj);
      }
    }

    get getfirst() {
        if (this.array.length === 0)
            return null;
        const first = this.array.shift();
        this.set.delete(first.player.UserId);
        return first;
    }
    get length() {
      return this.array.length;
    }
  }

  class random_obj {
    player: Player;
    GameMode: string;
    constructor() {
      this.player = new Player();
      this.GameMode = '';
    }
}



type UserMap = Map<string, {User: User, SocketId?: string, BallSocketId?: string, Status: string}>;

type TableMap = Map<string, table_obj>;

type RandomPlayer = Array<Random_Obj>;

export { Player, Ball, ballSpeed, UniqueSet, random_obj}
export type { UserMap, TableMap, RandomPlayer}
