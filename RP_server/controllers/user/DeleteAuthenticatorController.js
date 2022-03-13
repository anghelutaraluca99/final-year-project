const { authenticatorsQueries } = require("../../models/database_queries");

module.exports = async (req, res) => {
  let user = req.user;
  let userID = user.email;
  let credentialID = req.body.credentialID;

  let result = await authenticatorsQueries.deleteAuthenticator({
    userID: userID,
    credentialID: credentialID,
  });

  if (result) res.status(200).send({ message: "Authenticator deleted." });
  else res.status(500).send({ error: "Authenticator could not be deleted." });
};
