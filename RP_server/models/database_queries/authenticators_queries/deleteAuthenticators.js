const { authenticators } = require("../../schemas");
const mongoose = require("mongoose");

module.exports = async function (userID) {
  let data;
  try {
    data = await authenticators.deleteMany({ userID: userID });
    return true;
  } catch (err) {
    data = null;
    return err;
  }
};
