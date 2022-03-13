const WebAuthnServer = require("@simplewebauthn/server");
const {
  usersQueries,
  authenticatorsQueries,
} = require("../../../models/database_queries");
const { jwtUtils } = require("../../../utils");

module.exports = async (req, res) => {
  userID = req.body.user.email;

  // Get challenge from DB
  const challenge = await usersQueries.getUserChallenge(userID);

  // Verify the signed challenge
  let verification;
  try {
    verification = await WebAuthnServer.verifyRegistrationResponse({
      credential: req.body.attResp,
      expectedChallenge: challenge.toString(),
      expectedOrigin: "http://localhost:8080",
      expectedRPID: "localhost",
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }

  // If authenticator is successfully verified, replace existing authenticators with the new authenticator
  const { verified, registrationInfo } = verification;
  if (verified) {
    let { credentialPublicKey, credentialID, counter } = registrationInfo;
    let reset_challenge = await usersQueries.UpdateUserChallenge({
      userID: userID,
      challenge: "0",
    });

    // Delete all previous authenticators
    const delete_authenticators =
      await authenticatorsQueries.deleteAuthenticators(userID);

    // Save newly registered authenticator
    const resultRegisterAuthenticator =
      await authenticatorsQueries.registerAuthenticator({
        userID: userID,
        credentialID: credentialID.toString("hex"),
        credentialPublicKey: credentialPublicKey.toString("hex"),
      });

    if (delete_authenticators && resultRegisterAuthenticator) {
      // Construct and send JWT token
      const tokenPayload = {
        email: req.body?.user?.email,
        name: req.body?.user?.name,
        username: req.body?.user?.username,
      }; // construct token payload for JWT token
      const token = await jwtUtils.createToken(
        tokenPayload,
        process.env.JWT_SECRET
      ); // construct JWT token
      return res.status(200).send({
        messsage: "Authenticators reset auccessfully.",
        token: token,
      });
    } else {
      return res.status(500).send({
        error: "Account could not be reset. Unknown error.",
      });
    }
  }
  return res
    .status(500)
    .send({ error: "Account could not be reset. Unknown error." });
};
