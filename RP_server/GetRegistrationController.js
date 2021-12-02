const WebAuthnServer = require('@simplewebauthn/server');
const fs = require('fs');

module.exports.GetRegistration = (req, res) => {

    const options = WebAuthnServer.generateRegistrationOptions({
        rpName: 'WebAuthn',
        rpID: 'localhost',
        userID: '1234556',
        userName: 'Alice',
        attestationType: 'indirect',
    });


    let rawdata = fs.readFileSync('users.json');
    let users = JSON.parse(rawdata);
    users.push(options.challenge);
    let data = JSON.stringify(users);
    fs.writeFileSync('users.json', data);

    res.send(options);
}