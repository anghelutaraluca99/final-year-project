const { authenticators } = require("../../schemas");
const mongoose = require('mongoose');

module.exports = async function ({userID, credentialID}) {

    let authenticator;
    try {
        authenticator = await authenticators.findOne({userID: userID, credentialID: credentialID});
        const newCounter = authenticator.counter + 1;
        await authenticator.updateOne({ counter:  newCounter});
    } catch (err) {
        authenticator = null;
    }
};