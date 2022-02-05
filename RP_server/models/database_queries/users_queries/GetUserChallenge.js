const { users } = require("../../schemas");

module.exports = async function (userID) {

    let data;
    try {
        data = await users.find({ userID: userID }, "-_id");
        data = data[0].challenge;
    } catch (err) {
        data = null;
    }
    return data;
};