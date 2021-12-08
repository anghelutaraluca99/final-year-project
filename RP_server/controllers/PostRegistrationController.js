const WebAuthnServer = require('@simplewebauthn/server');
const {databaseQueries} = require("../models");

module.exports = async (req, res) => {

    userID = req.body.email;

    // Get challenge from DB
    const challenge = await databaseQueries.getUserRegistrationChallenge(userID);

    // Verify the signed challenge
    let verification;
    try {
        verification = await WebAuthnServer.verifyRegistrationResponse({
            credential: req.body.attResp,
            expectedChallenge: challenge.toString(),
            expectedOrigin: 'http://localhost:8080',
            expectedRPID: 'localhost',
        });
    } catch (error) {
        console.error(error);
        return res.status(400).send({ error: error.message });
    }

    const { verified, registrationInfo } = verification;

    if(verified) {
        const { credentialPublicKey, credentialID, counter } = registrationInfo;
        const newAuthenticator = {
            credentialID,
            credentialPublicKey,
            counter,
        };
    }
    console.log(verified);
    return { verified };
}