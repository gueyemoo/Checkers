const GamesModel = require("mongodatabase/GamesModel");
const commandDispatcher = require("commanddispatcher/CommandDispatcher").getInstance();

class GameManager {

    static instance = null;

    constructor() {
        this.games =  [];
        this.waitingList = [];
    }

    addGame(game) {
        this.games.push(game);
    }

    joinWaitingList(player) {
        this.waitingList.push(player);
        if (this.waitingList.length >= 2) {
            let player1 = this.waitingList[0];
            let player2 = this.waitingList[1];
            this.waitingList.remove(player1)
            this.waitingList.remove(player2)
            this.createGame(player1, player2);
        }
    }

    createGame(player1, player2) {
        GamesModel.createNewGame(player1.userId, player2.userId);
        console.log(GamesModel.getUserLastGame(player1.userId));
        const player1Data = {
            "userId": player1.userId,
            "user_color": 1
        };
        const player2Data ={
           "userId": player1.userId,
           "user_color": 2
        }
        commandDispatcher.dispatch("init_game", player1Data);
        commandDispatcher.dispatch("init_game", player2Data);
    }

    static getInstance() {
        if (GameManager.instance == null) GameManager.instance = new GameManager();
        return GameManager.instance;
    }
}

module.exports = GameManager;
