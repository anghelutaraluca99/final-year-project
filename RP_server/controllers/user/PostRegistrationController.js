const WebAuthnServer = require("@simplewebauthn/server");
const { jwtUtils } = require("../../utils");
const {
  usersQueries,
  authenticatorsQueries,
} = require("../../models/database_queries");

module.exports = async (req, res) => {
  userID = req.body.email;

  // Get challenge from DB
  const challenge = await usersQueries.getUserChallenge(userID);

  // Verify the signed challenge
  let verification;
  try {
    verification = await WebAuthnServer.verifyRegistrationResponse({
      credential: req.body.attResp,
      expectedChallenge: challenge.toString(),
      expectedOrigin: "http://localhost:8080",
      // expectedOrigin: process.env.FIDO_ORIGIN,
      expectedRPID: "localhost",
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }

  const { verified, registrationInfo } = verification;

  if (verified) {
    let { credentialPublicKey, credentialID, counter } = registrationInfo;
    let reset_challenge = await usersQueries.setUserCurrentChallenge({
      userID: userID,
      challenge: "0",
    });

    const resultRegisterAuthenticator =
      await authenticatorsQueries.registerAuthenticator({
        userID: userID,
        credentialID: credentialID.toString("hex"),
        credentialPublicKey: credentialPublicKey.toString("hex"),
      });

    const tokenPayload = {
      email: req.body?.email,
      name: req.body?.name,
      username: req.body?.username,
    }; // construct token payload for JWT token
    const token = await jwtUtils.createToken(
      tokenPayload,
      process.env.JWT_SECRET
    ); // construct JWT token

    const resp = {
      message: "Registration successful!",
      token: token,
      user: tokenPayload,
    };
    return res.status(200).send(resp);
  }
  return res.status(500).send({ error: "Unknown error." });
};
