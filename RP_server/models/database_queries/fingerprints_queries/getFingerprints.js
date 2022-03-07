const { fingerprints } = require("../../schemas");

module.exports = async function (userID) {

  let user_fingerprints = await fingerprints.findOne({ userID: userID });
  return user_fingerprints;
  
};