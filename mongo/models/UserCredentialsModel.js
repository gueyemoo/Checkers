import {getMongoose} from "./DB";

const extendMongooose = require('mongoose-schema-jsonschema');

extendMongooose(mongoose);

const { Schema } = mongoose;


const userCredentialSchema = new Schema({
    user_id: {type: Number, required: true, description: "User's id"},
    credentials: {type: String, required: true, description: "user's credentials stored in local storage"},
    datetime: {type: String, format: "date-time", required: true, description: "save date"}
});


export class UserCredentialsModel {

    static table = getMongoose().model("Users_Credientials", userCredentialSchema);

    static loadFromID(userID) {
        return this.table.findOne({_id: userID})
    }

    static loadFromUsername(username) {
        return this.table.findOne({username: username})
    }

    static getUserGames(userID) {

    }

    static getUserCredentials(userID) {
        this.table.findOne({user_id: userID})
    }


}
