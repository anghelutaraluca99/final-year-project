const { authenticators } = require("../../schemas");
const mongoose = require('mongoose');

module.exports = async function ({userID, credentialID}) {

    let data;
    try {
        data = await authenticators.find({userID: userID, credentialID: credentialID}, "-_id");
    } catch (err) {
        data = null;
    }

    return data[0];
};