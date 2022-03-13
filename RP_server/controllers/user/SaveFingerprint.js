const { fingerprintsQueries } = require("../../models/database_queries");

module.exports = async (req, res) => {
  try {
    const email = req.user.email;
    const fingerprint = req.body;

    // Save fingerprint in DB
    const response = await fingerprintsQueries.addFingerprint(
      email,
      fingerprint
    );

    res.status(200).send({ message: "Fingerprint added successfully!" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ error: "Fingerprint could not be saved." });
  }
};
