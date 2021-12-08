const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        userID: {
            type: "string",
        },
        username: {
            type: "string",
        },
        challenge: {
            type: "string", // TODO : make optional
        }
    },
    {
        timestamps: true,
    }
);

const user = mongoose.model("users", UserSchema);

module.exports = user;