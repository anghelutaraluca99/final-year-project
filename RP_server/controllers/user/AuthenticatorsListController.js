const WebAuthnServer = require('@simplewebauthn/server');
const {usersQueries, authenticatorsQueries} = require("../../models/database_queries");

module.exports = async (req, res) => {
    let user = req.user;
    let userID = user.email;
    let authenticators = await authenticatorsQueries.getAuthenticators(userID); 
    res.send(authenticators);
}