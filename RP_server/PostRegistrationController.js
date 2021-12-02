const WebAuthnServer = require('@simplewebauthn/server');
const fs = require('fs');

module.exports.PostRegistration = async (req, res) => {

    let rawdata = fs.readFileSync('users.json');
    let challenge = JSON.parse(rawdata);

    let verification;
    try {
        verification = await WebAuthnServer.verifyRegistrationResponse({
            credential: req.body,
            expectedChallenge: challenge.toString(),
            expectedOrigin: 'http://localhost:8080',
            expectedRPID: 'localhost',
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ error: error.message });
    }

    const { verified, registrationInfo } = verification;
    console.log(verified);

    return { verified };
}