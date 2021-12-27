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
        this.command(data);
    }
}

module.exports = Command;
