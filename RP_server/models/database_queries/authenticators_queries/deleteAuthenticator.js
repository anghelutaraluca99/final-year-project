const { authenticators } = require("../../schemas");
const mongoose = require('mongoose');

module.exports = async function ({userID, credentialID}) {

    let data;
    try {
        data = await authenticators.deleteOne({userID: userID, credentialID: credentialID});
        return true;
    } catch (err) {
        data = null;
        return err;
    }
};