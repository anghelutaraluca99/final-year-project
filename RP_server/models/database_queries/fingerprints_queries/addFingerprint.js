const { fingerprints } = require("../../schemas");

module.exports = async function (
     userID,
     new_fingerprint
 ) {
  let existing_records = await fingerprints.findOne({ userID: userID });
  if(existing_records === null) {
    // user has no fingerprints stored
    const fingerprint = new fingerprints({
      userID: userID,
      fingerprints: [{
        ...new_fingerprint,
        timestamp: new Date(), 
      }],
    });
    res = await fingerprint.save();
    return res;

  } else {
    // user has fingerprints stored
    let user_fingerprints = await fingerprints.findOne({userID : userID});
    fingerprints_list = user_fingerprints.fingerprints;
    fingerprints_list.unshift({
      ...new_fingerprint,
      timestamp: new Date(), 
    });
    res = await fingerprints.updateOne({userID: userID}, {fingerprints: fingerprints_list});
    return res;
  }
};