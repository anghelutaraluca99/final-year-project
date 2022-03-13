const WebAuthnServer = require("@simplewebauthn/server");
const { jwtUtils } = require("../../utils");
const {
  usersQueries,
  authenticatorsQueries,
} = require("../../models/database_queries");

module.exports = async (req, res) => {
  const userID = req.body.email;
  const data = await usersQueries.getUser(userID);
  // Do not send the whole user object, just the required fields
  const user = {
    email: data?.userID,
    name: data?.name,
    username: data?.username,
  };
  // Check user is registered
  if (user === null)
    return res
      .status(404)
      .send({ message: `Could not find user ${req.body.email}` });

  const credID = Buffer.from(req.body.asseResp.id, "Base64").toString("hex");
  const challenge = await usersQueries.getUserChallenge(userID); // get challenge from DB
  const authenticator = await authenticatorsQueries.getUserAuthenticatorByID({
    userID: userID,
    credentialID: credID,
  }); // get authenticaor from DB

  if (!authenticator) {
    console.log(`Could not find authenticator ${req.body.asseResp.id}`);
    return res.status(400).send({
      message: `Could not find authenticator ${req.body.asseResp.id}`,
    });
  }

  let verification;
  try {
    verification = await WebAuthnServer.verifyAuthenticationResponse({
      credential: req.body.asseResp,
      expectedChallenge: challenge,
      expectedOrigin: "http://localhost:8080",
      // expectedOrigin: FIDO_ORIGIN,
      expectedRPID: "localhost",
      authenticator: authenticator,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error: error.message });
  }

  const { verified, authenticationInfo } = verification;

  if (verified) {
    // authorised

    await authenticatorsQueries.updateAuthenticatorCounter({
      userID: userID,
      credentialID: credID,
    }); //update authenticator counter
    await usersQueries.setUserCurrentChallenge({
      userID: userID,
      challenge: "0",
    }); // reset challenge

    const token = await jwtUtils.createToken(user, process.env.JWT_SECRET); // construct JWT token

    const resp = {
      message: "Login successful!",
      token: token,
      user: user,
    };
    return res.status(200).send(resp); // construct and send response
  } else {
    // unauthorised

    return res.status(401).send({
      message: "Login failed!",
      error: "", // TODO :: add error handling
    });
  }
};
