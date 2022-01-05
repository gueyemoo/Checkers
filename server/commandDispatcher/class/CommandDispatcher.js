const gameManager = require("gamemanager/GameManager").getInstance();

const initGameCommand = function (data) {

}

const endGameCommand = function (data) {

}
const moveCommand = function (data) {

}


const formLoginCommand = function (data) {
    
}

const tokenLogin = function (data) {

}

class CommandDispatcher {

    static instance = null;

    constructor() {
        const Command = require("./Command.js");
        this.commands = []
        this.commands["end_game"] = new Command("end_game", endGameCommand);
        this.commands["form_login"] = new Command("form_login", formLoginCommand);
        this.commands["init_game"] = new Command("init_game", initGameCommand);
        this.commands["move"] = new Command("move", moveCommand);
        this.commands["token_login"] = new Command("token_login", tokenLogin);
    }

    dispatch(command, data) {
        if (!this.commands[command]) return;
        if (!this.commands[command].validate(data)) return;
        this.commands[command].execute(data);
    }

    static getInstance() {
        if (CommandDispatcher.instance === null) CommandDispatcher.instance = new CommandDispatcher();
        return CommandDispatcher.instance;
    }

}

module.exports = CommandDispatcher;
