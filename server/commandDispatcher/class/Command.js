class Command {

    constructor(name, command) {
        this.name = name;
        let Validator = require('jsonschema').Validator;
        this.validator = new Validator();
        this.schema = require('../schema/' + this.name + '.json')
        this.command = command;
    }

    validate(object) {
        return this.validator.validate(object, this.schema).valid;
    }

    execute(data) {
        if (this.validate(data)) {
            this.command(data);
        } else console.log("Commande non reconnue : " + this.name + " pour les data : " + data);
    }
}

module.exports = Command;
