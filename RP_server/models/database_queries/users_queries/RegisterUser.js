const { users } = require("../../schemas");

module.exports = async function ({ userID, username, challenge }) {
  let res = await users.updateOne({ userID: userID }, { challenge: challenge });
  return res;
};
