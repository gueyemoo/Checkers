import {getMongoose} from "./DB";

const extendMongooose = require('mongoose-schema-jsonschema');

extendMongooose(mongoose);

const {Schema} = mongoose;


const gameStatesSchema = new Schema({
    user_id_1: {type: Number, required: true, description: "first user id"},
    user_id_2: {type: Number, required: true, description: "second user id"},
    datetime: {type: String, format: "date-time", required: true, description: "save date"},
    winner_id: {type: Number, required: false, description: "Winner user id"}
});


export class GammeStatesModel {

    static table = getMongoose().model("Game_States", gameStatesSchema);

    static getGameStates(gameID) {
        return this.table.find({gameID: gameID});
    }
}
