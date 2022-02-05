const WebAuthnServer = require('@simplewebauthn/server');
const {usersQueries, authenticatorsQueries} = require("../models/database_queries");

module.exports = async (req, res) => {

    userID = req.body.email;
    //TODO :: fix the formatting of id
    const credID = Buffer.from(req.body.asseResp.id, 'Base64').toString('hex');

    const challenge = await usersQueries.getUserChallenge(userID);
    const authenticator = await authenticatorsQueries.getUserAuthenticatorByID({userID: userID, credentialID: credID});

    if (!authenticator) {
        console.log(`Could not find authenticator ${req.body.asseResp.id}`);
        return res.status(400).send({message: `Could not find authenticator ${req.body.asseResp.id}`});
    }

    let verification;
    try {
        verification = await WebAuthnServer.verifyAuthenticationResponse({
            credential: req.body.asseResp,
            expectedChallenge: challenge,
            expectedOrigin: 'http://localhost:8080',
            expectedRPID: 'localhost',
            authenticator: authenticator,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: error.message });
    }

    const { verified, authenticationInfo } = verification;
    console.log(verified);

    res.send({verified});
}