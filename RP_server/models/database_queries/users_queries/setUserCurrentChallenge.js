const { users } = require("../../schemas");

module.exports = async function ({
     userID,
     new_challenge,
 }) {

    let res;
    try {
        res = await users.update({userID: userID}, {challenge: new_challenge});
        let data = await users.find({ userID: userID }, "-_id");
        data = data[0].challenge;
        res = data;
    } catch (err) {
        res = err;
    }
    return res;
};