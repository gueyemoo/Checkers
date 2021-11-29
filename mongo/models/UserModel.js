import {getMongoose} from "./DB";

const extendMongooose = require('mongoose-schema-jsonschema');

extendMongooose(mongoose);

const { Schema } = mongoose;


const userSchema = new Schema({
    username: {type: String, required: true, description: "User's username"},
    password: {type: String, required: true, description: "user's password"}
});


export class UserModel {

    static model = getMongoose().model("Users", userSchema);

    static saveUser(username, hpassword) {
        let user = new this.model({username: username, password: hpassword});
        return user.save()
    }

    static loadFromID(userID) {
        return this.model.findOne({_id: userID})
    }

    static loadFromUsername(username) {
        return this.model.findOne({username: username})
    }

    static getUserGames(userID) {

    }

    static getUserCredentials(userID) {}


}
