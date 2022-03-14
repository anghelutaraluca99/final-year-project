const WebAuthnServer = require("@simplewebauthn/server");
const {
  usersQueries,
  authenticatorsQueries,
} = require("../../models/database_queries");

module.exports = async (req, res) => {
  const userID = req.body.email;
  const user = await usersQueries.getUser(userID);
  // Check user is registered
  if (user === null) {
    // User does not exist
    return res
      .status(401)
      .send({ error: `User ${req.body.email} does not exist` });
  } else {
    const existing_authenticators =
      await authenticatorsQueries.getAuthenticators(userID);
    if (existing_authenticators?.length === 0) {
      // User has pre-registered, but has not completed registration
      // Keeping the same error message as to not alert a potential attacker
      return res
        .status(401)
        .send({ error: `User ${req.body.email} does not exist` });
    }
  }

  let authenticators = await authenticatorsQueries.getAuthenticators(userID);

  const options = WebAuthnServer.generateAuthenticationOptions({
    allowCredentials: authenticators.map((authenticator) => ({
      id: Buffer.from(authenticator.credentialID, "hex"),
      type: "public-key",
    })),
    userVerification: "preferred",
  });

  // Resets challenge for user
  let resNewChallenge = await usersQueries.setUserCurrentChallenge({
    userID: userID,
    challenge: options.challenge,
  });
  res.send(options);
};
