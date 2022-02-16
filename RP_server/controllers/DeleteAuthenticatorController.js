const WebAuthnServer = require('@simplewebauthn/server');
const {usersQueries, authenticatorsQueries} = require("../models/database_queries");

module.exports = async (req, res) => {

    let user = req.user;
    let userID = user.email;
    let credentialID = req.body.credentialID;
    console.log(req.body);

    let result = await authenticatorsQueries.deleteAuthenticator({userID: userID, credentialID: credentialID});
    console.log(result);
    
    res.send(result);
}