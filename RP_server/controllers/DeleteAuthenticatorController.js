const WebAuthnServer = require('@simplewebauthn/server');
const {usersQueries, authenticatorsQueries} = require("../models/database_queries");

module.exports = async (req, res) => {

    let user = req.user;
    let userID = user.email;
    let credentialID = req.body.credentialID;

    let result = await authenticatorsQueries.deleteAuthenticator({userID: userID, credentialID: credentialID});
    
    res.send(result);
}