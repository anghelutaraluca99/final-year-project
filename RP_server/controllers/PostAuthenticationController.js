const WebAuthnServer = require('@simplewebauthn/server');
const {jwtUtils} = require("../utils");
const {usersQueries, authenticatorsQueries} = require("../models/database_queries");

module.exports = async (req, res) => {

    const userID = req.body.email;
    const credID = Buffer.from(req.body.asseResp.id, 'Base64').toString('hex'); // TODO - improve formatting
    const challenge = await usersQueries.getUserChallenge(userID); // get challenge from DB
    const authenticator = await authenticatorsQueries.getUserAuthenticatorByID({userID: userID, credentialID: credID}); // get authenticaor from DB

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
    console.log(authenticationInfo);

    if (verified) {
        await authenticatorsQueries.updateAuthenticatorCounter({userID: userID, credentialID: credID});
        const tokenPayload = {
            email: req.body.email,
            name: req.body.name,
            username: req.body.username
        };
        console.log(process.env.JWT_SECRET);
        const token = await jwtUtils.createToken(
            tokenPayload,
            process.env.JWT_SECRET
        );
        console.log(token);
    }

    res.send({verified});
}