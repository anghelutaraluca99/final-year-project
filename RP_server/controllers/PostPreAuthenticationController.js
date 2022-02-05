const WebAuthnServer = require('@simplewebauthn/server');
const {usersQueries, authenticatorsQueries} = require("../models/database_queries");


module.exports = async (req, res) => {

    let userID = req.body.email;
    let userName = req.body.username;

    let authenticators = await authenticatorsQueries.getAuthenticators(userID);

    const options = WebAuthnServer.generateAuthenticationOptions({
        allowCredentials: authenticators.map(authenticator => ({
            //TODO
            id: Buffer.from(authenticator.credentialID, 'hex'),
            type: 'public-key',
            // Optional
            // transports: authenticator.transports,
        })),
        userVerification: 'preferred',
    });

    // Resets challenge for user
    let resNewChallenge = await usersQueries.setUserCurrentChallenge({userID: userID, new_challenge: options.challenge});

    res.send(options);
}