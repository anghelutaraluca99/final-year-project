const { users } = require("../../schemas");

module.exports = async function ({
     userID,
     username,
     challenge
 }) {

    const user = new users({
        userID: userID,
        username: username,
        challenge: challenge,
    });
    res = await user.save();
    return res;
};