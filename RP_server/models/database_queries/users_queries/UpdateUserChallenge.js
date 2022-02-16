const { users } = require("../../schemas");

module.exports = async function ({
     userID,
     challenge,
 }) {

    let res;
    try {
        res = await users.updateOne({userID: userID}, {challenge: challenge});
        console.log(res);
        let data = await users.findOne({ userID: userID });
        res = data.challenge === challenge
    } catch (err) {
        res = err;
    }
    return res;
};