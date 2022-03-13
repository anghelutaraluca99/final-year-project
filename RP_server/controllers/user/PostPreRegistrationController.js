const WebAuthnServer = require("@simplewebauthn/server");
const {
  usersQueries,
  authenticatorsQueries,
} = require("../../models/database_queries");

module.exports = async (req, res) => {
  const userID = req.body.email;
  const username = req.body.username;
  const name = req.body.name;

  const opt = {
    rpName: "WebAuthn",
    rpID: "localhost",
    userID: userID,
    userName: username,
    attestationType: "indirect",
  };

  const options = WebAuthnServer.generateRegistrationOptions(opt);

  // check if user is recorded in db
  const existing_user = await usersQueries.getUser(userID);
  if (existing_user) {
    // check if user has authenticators registered
    const existing_authenticators =
      await authenticatorsQueries.getAuthenticators(userID);
    if (existing_authenticators?.length !== 0) {
      // if user has authenticators; do not register; else register
      return res.status(409).send({
        error: "Email already registered.",
      });
    } else {
      await usersQueries.setUserCurrentChallenge({
        userID: userID,
        challenge: options.challenge,
      });
      return res.send(options);
    }
  } else {
    await usersQueries.preRegisterUser({
      userID: userID,
      username: username,
      name: name,
      challenge: options.challenge,
    });
    return res.send(options);
  }
};
