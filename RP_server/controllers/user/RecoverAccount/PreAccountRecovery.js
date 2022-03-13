const WebAuthnServer = require("@simplewebauthn/server");
const {
  usersQueries,
  fingerprintsQueries,
} = require("../../../models/database_queries");

module.exports = async (req, res) => {
  req = req.body;
  let userID = req.user.email;
  let username = req.user.username;
  let name = req.user.name;
  let fingerprint = req.fingerprint;

  let user = await usersQueries.getUser(userID);

  if (!(username === user?.username && name === user?.name)) {
    return res.status(401).send({
      error:
        "User details are incorrect. Not authorized to reset authenticator.",
    });
  }

  // verify fingreprint against existing records
  try {
    // Get all observed fingerprints for a user
    const existing_fingerprints = await fingerprintsQueries.getFingerprints(
      userID
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

      if (no_of_matches === 0) {
        // No record matched given fingerprint
        return res.status(401).send({
          error:
            "Fingerprint could not be validated. Not authorized to reset authenticator.",
        });
      }
    } else {
      // No records are available
      return res.status(401).send({
        error:
          "Fingerprint could not be validated. Not authorized to reset authenticator.",
      });
    }
  } catch (e) {
    // Error
    return res.status(401).send({
      error:
        "Fingerprint could not be validated. Not authorized to reset authenticator.",
    });
  }

  const opt = {
    rpName: "WebAuthn",
    rpID: "localhost",
    userID: userID,
    userName: username,
    attestationType: "indirect",
  };

  const options = WebAuthnServer.generateRegistrationOptions(opt);

  const updateChallenge = await usersQueries.setUserCurrentChallenge({
    userID: userID,
    challenge: options.challenge,
  });
  res.send(options);
};
