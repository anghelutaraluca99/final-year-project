const WebAuthnServer = require('@simplewebauthn/server');

module.exports = (req, res) => {
    res.status(200).send({
        page: 'Post Auth page'
    });
}