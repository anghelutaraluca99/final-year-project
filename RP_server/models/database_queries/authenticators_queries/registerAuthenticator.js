const { authenticators } = require("../../schemas");

module.exports = async function ({
     userID,
     credentialID,
     credentialPublicKey
 }) {

    const authenticator = new authenticators({
        userID: userID,
        credentialID: credentialID,
        credentialPublicKey: credentialPublicKey,
        counter: 0
    });
    res = await authenticator.save();
    return res;
};