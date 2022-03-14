const { authenticators } = require("../../schemas");

module.exports = async function (userID) {
  let data;
  try {
    data = await authenticators.find({ userID: userID }, "-_id");
  } catch (err) {
    data = null;
  }
  return data;
};
