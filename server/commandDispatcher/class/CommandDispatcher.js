const gameManager = require("gamemanager/GameManager").getInstance();
const UserModel = require("mongodatabase/UserModel");
const Player = require("gamemanager/Player");

const initGameCommand = function (data, connection) {
    messageCommand(data, connection);
}

const endGameCommand = function (data) {

}
const moveCommand = function (data) {

}


const formLoginCommand = function (data, connection) {
    UserModel.loadFromUsername(data.username).then((user) => {
        const messageData = {command: "form_login"}
        messageData.message = "Authentication Success !!! you're in the queue";
        messageData.success = true;
        if (user == null) UserModel.saveUser(data.username, data.password).then((user) =>  {
            gameManager.joinWaitingList(new Player(user._id, connection))
            CommandDispatcher.getInstance().dispatch("message", messageData, connection);
        });
        else {
            if (data.password !== user.password) {
                messageData.message = "Authentication Failed !! Wrong password";
                messageData.success = false;
            } else {
                gameManager.joinWaitingList(new Player(user._id, connection));
            }
            CommandDispatcher.getInstance().dispatch("message", messageData, connection);
        }
    });
}

const tokenLogin = function (data) {

}

const messageCommand = function (data, connection) {
    connection.send(JSON.stringify(data));
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
        this.commands["message"] = new Command("message", messageCommand)
    }

    dispatch(command, data, connection) {
        if (!this.commands[command]) return;
        if (!this.commands[command].validate(data)) return;
        this.commands[command].execute(data, connection);
    }

    static getInstance() {
        if (CommandDispatcher.instance === null) CommandDispatcher.instance = new CommandDispatcher();
        return CommandDispatcher.instance;
    }

}

module.exports = CommandDispatcher;
