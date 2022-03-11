const {fingerprintsQueries} = require("../../models/database_queries");
// const { compObjects, compResults } = require("../../utils");

module.exports = async (req, res) => {
  try {
    const email = req.user.email;
    const fingerprint = req.body;
    
    // Get all observed fingerprints for a user
    const existing_fingerprints = await fingerprintsQueries.getFingerprints(email);

    // Compare received fingerprint with existing fingerprints
    const no_of_records = existing_fingerprints.fingerprints.length;
    let no_of_matches = 0;

    for (let i = 0; i < no_of_records; i++) {
      let recorded_fingerprint = existing_fingerprints.fingerprints[i];
      if (recorded_fingerprint.visitorId === fingerprint.visitorId)
        no_of_matches++;
    }
    console.log("Matches " + no_of_matches + " records out of " + no_of_records);

    // Save fingerprint in DB
    const response = await fingerprintsQueries.addFingerprint(email, fingerprint);

    res.status(200).send({message: "Fingerprint added successfully!"});
  } catch(e) {
    console.log(e);
    req.status(500).send({error: "Fingerprint could not be saved."});
  }
}