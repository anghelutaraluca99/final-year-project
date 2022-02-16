const { users } = require("../../schemas");

module.exports = async function ({
     userID,
     challenge,
 }) {

    let res;
    try {
        let data = await users.findOne({ userID: userID }, "-_id");
        data.challenge = challenge;
        await data.save();
        data = await users.findOne({ userID: userID }, "-_id");
        res = data.challenge === challenge
    } catch (err) {
        res = err;
    }
    return res;
};