const { fingerprintsQueries } = require("../../models/database_queries");

module.exports = async (req, res) => {
  try {
    const email = req.user.email;
    const fingerprint = req.body;

    // Get all observed fingerprints for a user
    const existing_fingerprints = await fingerprintsQueries.getFingerprints(
      email
    );

    // Compare received fingerprint with existing fingerprints
    if (existing_fingerprints) {
      const no_of_records = existing_fingerprints.fingerprints.length;
      let no_of_matches = 0;

      for (let i = 0; i < no_of_records; i++) {
        let recorded_fingerprint = existing_fingerprints.fingerprints[i];
        if (recorded_fingerprint.visitorId === fingerprint.visitorId)
          no_of_matches++;
      }
      console.log(
        "Matches " + no_of_matches + " records out of " + no_of_records
      );
      if (no_of_matches > 0) {
        return res.status(200).send({ message: "Fingerprint matches records" });
      } else {
        // No record matched given fingerprint
        return res
          .status(404)
          .send({ error: "Fingerprint could not be validated" });
      }
    } else {
      // No records are available
      return res
        .status(404)
        .send({ error: "Fingerprint could not be validated" });
    }
  } catch (e) {
    // Error
    return res
      .status(500)
      .send({ error: "Fingerprint could not be validated" });
  }
};
