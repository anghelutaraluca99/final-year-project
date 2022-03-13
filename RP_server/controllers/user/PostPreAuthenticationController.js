const WebAuthnServer = require("@simplewebauthn/server");
const {
  usersQueries,
  authenticatorsQueries,
} = require("../../models/database_queries");

module.exports = async (req, res) => {
  let userID = req.body.email;
  const user = await usersQueries.getUser(userID);
  // Check user is registered
  if (user === null)
    return res
      .status(404)
      .send({ message: `Could not find user ${req.body.email}` });

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
