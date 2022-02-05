const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AuthenticatorSchema = new Schema(
    {
        userID: {
            type: "string",
        },
        credentialID: {
            // type: "Buffer",
            type: "string",
        },
        credentialPublicKey: {
            // type: "Buffer",
            type: "string",
        },
        counter: {
            type: "number",
        },
        // transports: {
        //     AuthenticatorTransport[] // TODO : make optional
        // },
    },
    {
        timestamps: true,
    }
);

const authenticators = mongoose.model("authenticators", AuthenticatorSchema);

module.exports = authenticators;