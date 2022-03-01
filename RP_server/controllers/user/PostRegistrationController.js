const WebAuthnServer = require('@simplewebauthn/server');
const {usersQueries, authenticatorsQueries} = require("../../models/database_queries");

module.exports = async (req, res) => {

    userID = req.body.email;

    // Get challenge from DB
    const challenge = await usersQueries.getUserChallenge(userID);

    // Verify the signed challenge
    let verification;
    try {
        verification = await WebAuthnServer.verifyRegistrationResponse({
            credential: req.body.attResp,
            expectedChallenge: challenge.toString(),
            expectedOrigin: 'http://localhost:8080',
            // expectedOrigin: process.env.FIDO_ORIGIN,
            expectedRPID: 'localhost',
        });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }

    const { verified, registrationInfo } = verification;

    if(verified) {
        let { credentialPublicKey, credentialID, counter } = registrationInfo;
        let reset_challenge = await usersQueries.UpdateUserChallenge({userID: userID, challenge: "0"});

        const resultRegisterAuthenticator = await authenticatorsQueries.registerAuthenticator({
            userID: userID,
            credentialID: credentialID.toString('hex'),
            credentialPublicKey: credentialPublicKey.toString('hex')
        });
    }
    return { verified };
}