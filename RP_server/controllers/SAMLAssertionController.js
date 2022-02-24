const saml = require('saml').Saml20;
const fs = require('fs')
const path = require("path");

module.exports = async (req, res) => {

    var options = {
    cert: fs.readFileSync(path.resolve(__dirname, '../localhost_public.csr')),
    key: fs.readFileSync(path.resolve(__dirname, '../localhost_private.key')),
    issuer: 'http://localhost:3000',
    lifetimeInSeconds: 600,
    audiences: 'http://localhost:4000',
    attributes: {
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': req.user.email,
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': req.user.name,
    },
    nameIdentifier: req.user.email,
    sessionIndex: '_faed468a-15a0-4668-aed6-3d9c478cc8fa'
    };

    var signedAssertion = saml.create(options);
    console.log(signedAssertion);
    return res.send(signedAssertion);
}