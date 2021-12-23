class CommandDispatcher {

    constructor() {
        this.commands = []

        this.commands["end_game"] = new Command("end_game")
        this.commands["form_login"] = new Command("form_login")
        this.commands["init_game"] = new Command("init_game")
        this.commands["move"] = new Command("move");
        this.commands["token_login"] = new Command("token_login")
    }

    dispatch(command, data) {
        if (!this.commands[command]) return;
        if (!this.commands[command].validate(data)) return;
        this.commands[command].execute(data);
    }

}
