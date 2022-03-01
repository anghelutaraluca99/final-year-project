const WebAuthnServer = require('@simplewebauthn/server');
const {usersQueries} = require("../../models/database_queries");

module.exports = async (req, res) => {

    let userID = req.user.email;
    let userName = req.user.username;

    const opt = {
        rpName: 'WebAuthn',
        rpID: 'localhost',
        userID: userID,
        userName: userName,
        attestationType: 'indirect',
    };

    const options = WebAuthnServer.generateRegistrationOptions(opt);

    const updateChallenge = await usersQueries.UpdateUserChallenge({
        userID : userID,
        challenge: options.challenge
    });    
    res.send(options);
}