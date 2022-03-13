const { users } = require("../../schemas");

module.exports = async function ({ userID, username, name, challenge }) {
  const user = new users({
    userID: userID,
    username: username,
    name: name,
    challenge: challenge,
  });
  res = await user.save();

  return res;
};
