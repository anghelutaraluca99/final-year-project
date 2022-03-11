const WebAuthnServer = require('@simplewebauthn/server');
const {usersQueries, authenticatorsQueries} = require("../../models/database_queries");

module.exports = async (req, res) => {

    userID = req.user.email;

    // Get challenge from DB
    const challenge = await usersQueries.getUserChallenge(userID);

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
        return res.status(400).send({ error: error.message });
    }

    const { verified, registrationInfo } = verification;

    if(verified) {
        let { credentialPublicKey, credentialID, counter } = registrationInfo;
        let reset_challenge = await usersQueries.UpdateUserChallenge({userID: userID, challenge: "0"});

        console.log(reset_challenge);

        const resultRegisterAuthenticator = await authenticatorsQueries.registerAuthenticator({
            userID: userID,
            credentialID: credentialID.toString('hex'),
            credentialPublicKey: credentialPublicKey.toString('hex')
        });
        return res.status(200).send({ messsage: "Authenticator registered successfully" });
    }
    return res.status(500).send({ error: "Authentication registration failed. Unknown error." });
}