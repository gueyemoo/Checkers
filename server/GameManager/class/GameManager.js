const GamesModel = require("mongodatabase/GamesModel");
const Game = require("gamemanager/Game");

class GameManager {

    static instance = null;

    constructor() {
        this.games = [];
        this.waitingList = [];
    }

    addGame(game) {
        this.games.push(new Game(game._id, game.user_id_1, game.user_id_2));
    }

    joinWaitingList(player) {
        console.log("User : " + player.userId + " placed in the queue");
        this.waitingList.push(player);
        if (this.waitingList.length >= 2) {
            let player1 = this.waitingList[0];
            let player2 = this.waitingList[1];
            this.waitingList.splice(0, 1);
            this.waitingList.splice(1, 1);
            this.createGame(player1, player2);
        }
    }

    createGame(player1, player2) {
        GamesModel.createNewGame(player1.userId, player2.userId);
        GamesModel.getUserLastGame(player1.userId, GameManager.addGame);
        const player1Data = {
            "command": "init_game",
            "user_id": player1.userId,
            "user_color": 1
        };
        const player2Data = {
            "command": "init_game",
            "user_id": player1.userId,
            "user_color": 2
        }
        const commandDispatcher = require("commanddispatcher/CommandDispatcher").getInstance();
        commandDispatcher.dispatch("init_game", player1Data);
        commandDispatcher.dispatch("init_game", player2Data);
    }

    static getInstance() {
        if (GameManager.instance == null) GameManager.instance = new GameManager();
        return GameManager.instance;
    }
}

module.exports = GameManager;
