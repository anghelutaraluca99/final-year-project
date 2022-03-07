const {fingerprintsQueries} = require("../../models/database_queries");


module.exports = async (req, res) => {
  try {
    const email = req.user.email;
    const fingerprint = req.body;
    const response = await fingerprintsQueries.addFingerprint(email, fingerprint);
    const fingerprints = await fingerprintsQueries.getFingerprints(email);
    res.status(200).send({message: "Fingerprint added successfully!"});
  } catch(e) {
    console.log(e);
    req.status(500).send({error: "Fingerprint could not be saved."});
  }
}