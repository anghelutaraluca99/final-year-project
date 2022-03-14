const WebAuthnServer = require("@simplewebauthn/server");
const {
  usersQueries,
  authenticatorsQueries,
} = require("../../../models/database_queries");
const { jwtUtils } = require("../../../utils");

module.exports = async (req, res) => {
  const userID = req.body.user.email;

  // get user details to return with JWT
  const data = await usersQueries.getUser(userID);
  const user = {
    email: data?.userID,
    name: data?.name,
    username: data?.username,
  };

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
    return res
      .status(400)
      .send({
        error: "Account recovery failed. Authenticator verification failed.",
      });
  }

  // If authenticator is successfully verified, replace existing authenticators with the new authenticator
  const { verified, registrationInfo } = verification;
  if (verified) {
    let { credentialPublicKey, credentialID } = registrationInfo;
    await usersQueries.setUserCurrentChallenge({
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
      const token = await jwtUtils.createToken(user, process.env.JWT_SECRET); // construct JWT token
      return res.status(200).send({
        messsage: "Authenticators reset auccessfully.",
        token: token,
        user: user,
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
