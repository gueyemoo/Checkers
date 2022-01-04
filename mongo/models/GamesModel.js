const DBModule = require('../DB.js')

const mongoose = DBModule.getMongoose();

const extendMongooose = require('mongoose-schema-jsonschema');

extendMongooose(mongoose);

const {Schema} = mongoose;


const gamesSchema = new Schema({
    user_id_1: {type: Number, required: true, description: "first user id"},
    user_id_2: {type: Number, required: true, description: "second user id"},
    datetime: {type: String, format: "date-time", required: true, description: "save date"},
    winner_id: {type: Number, required: false, description: "Winner user id"}
});


class GammesModel {

    static table = mongoose.model("Games", gamesSchema);

    static loadFromID(gameID) {
        return this.table.findOne({_id: gameID});
    }

    static getUserGames(userID) {
        return this.table.find({$or: [{user_id_1: userID}, {user_id_2: userID}]});
    }

    static createNewGame(player1Id, player2Id) {
        this.table.insert({
            "user_id_1": player1Id,
            "user_id_2": player2Id,
            "datetime": Date.now().toString()
        }).save();
    }
}

module.exports = {GammesModel};
