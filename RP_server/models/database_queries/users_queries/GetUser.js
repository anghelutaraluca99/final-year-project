const { users } = require("../../schemas");

module.exports = async function ({ userID }) {
  let user = await users.findOne({ userID: userID }, "-_id");
  return user;
};
