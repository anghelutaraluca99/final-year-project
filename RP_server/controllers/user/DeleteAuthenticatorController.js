const { authenticatorsQueries } = require("../../models/database_queries");

module.exports = async (req, res) => {
  let user = req.user;
  let userID = user.email;
  let credentialID = req.body.credentialID;

  let authenticators = await authenticatorsQueries.getAuthenticators(userID);

  if (authenticators.length === 1)
    return res.status(500).send({
      error:
        "Authenticator could not be deleted. Account must have at least 1 authenticator.",
    });

  let result = await authenticatorsQueries.deleteAuthenticator({
    userID: userID,
    credentialID: credentialID,
  });

  if (result)
    return res.status(200).send({ message: "Authenticator deleted." });
  else
    return res
      .status(500)
      .send({ error: "Authenticator could not be deleted." });
};
