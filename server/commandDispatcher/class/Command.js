class Command {

    constructor(name, command) {
        this.name = name;
        let Validator = require('jsonschema').Validator;
        this.validator = new Validator();
        const commandSchema = require("../schema/command.json");
        this.validator.addSchema(commandSchema, "/command");
        this.schema = require('../schema/' + this.name + '.json')
        this.command = command;
    }

    validate(object) {
        const validator = this.validator.validate(object, this.schema);
        console.log(validator.errors);
        return validator.valid;
    }

    execute(data, connection) {
        if (this.validate(data)) {
            this.command(data, connection);
        } else console.log("Commande non reconnue : " + this.name + " pour les data : " + JSON.stringify(data));
    }
}

module.exports = Command;
