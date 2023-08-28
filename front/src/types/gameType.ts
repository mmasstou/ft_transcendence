type GameSetting = {
    table: string[];
    ball: string;
    player: string;
    avatar: string;
}

type Player = {
    UserId: string;
    position: number;
    score: number;
    GameSetting: GameSetting;
}

type Ball = {
    x: number;
    y: number;
}

type table_obj = {
    player1: Player
    player2: Player
    ball: Ball
    Status: boolean
    current: any
    currentTimer: any
    tableId: string
    GameMode: string
    imageLoad: number
    time: number
    countdown: number
    intervaldelay: number
  }

export type TableMap = Map<string, table_obj>