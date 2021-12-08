const WebAuthnServer = require('@simplewebauthn/server');
const {databaseQueries} = require("../models");
const fs = require('fs');

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

    // To be replaced with database queries
    // let rawdata = fs.readFileSync('users.json');
    // let users = JSON.parse(rawdata);

    // let newUser = {
    //     userID : userID,
    //     userName : userName,
    //     challenge : options.challenge
    // };
    // users.push(newUser);

    const userPreRegisterResult = await databaseQueries.preRegisterUser({
        userID : userID,
        userName : userName,
        challenge: options.challenge
    });

    // To be replaced with database queries
    // let data = JSON.stringify(users);
    // fs.writeFileSync('users.json', data);

    res.send(options);
}