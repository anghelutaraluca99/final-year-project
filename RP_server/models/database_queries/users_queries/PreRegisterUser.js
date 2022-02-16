const { users } = require("../../schemas");

module.exports = async function ({
     userID,
     username,
     challenge
 }) {

    let valid = await users.findOne({ userID: userID }, "-_id");
    if(valid === null) {
        const user = new users({
            userID: userID,
            username: username,
            challenge: challenge,
        });
        res = await user.save();
    } else {
        res = "Error: email already registered"
    }
    return res;
};