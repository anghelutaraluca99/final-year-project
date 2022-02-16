const WebAuthnServer = require('@simplewebauthn/server');
const {usersQueries} = require("../models/database_queries");

module.exports = async (req, res) => {

    // TBC
    let userID = req.body.email;
    let userName = req.body.username;

    const opt = {
        rpName: 'WebAuthn',
        rpID: 'localhost',
        userID: userID,
        userName: userName,
        attestationType: 'indirect',
    };

    const options = WebAuthnServer.generateRegistrationOptions(opt);

    const userPreRegisterResult = await usersQueries.preRegisterUser({
        userID : userID,
        userName : userName,
        challenge: options.challenge
    });
    if(userPreRegisterResult === "Error: email already registered")
        res.status(409).send({
            error: "Email already registered."
        });
    else    
      res.send(options);
}