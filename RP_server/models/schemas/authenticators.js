const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        credentialID: {
            type: "buffer",
        },
        credentialPublicKey: {
            type: "buffer",
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

const authenticators = mongoose.model("authenticators", UserSchema);

module.exports = authenticators;