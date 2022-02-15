const saml = require('saml2-js');

module.exports = async (req, res) => {

    const sp_options = {
        entity_id: "http://localhost:4000/",
        private_key: process.env.CERT,
        certificate: process.env.KEY,
        assert_endpoint: "http://localhost:3000/samlProvider/"
      };
    const sp = new saml.ServiceProvider(sp_options);

    const idp_options = {
        sso_login_url: "http://localhost:3000/samlProvider",
        sso_logout_url: "http://localhost:3000/samlProvider",
        certificates: process.env.IDP_CERT,
        force_authn: true,
        sign_get_request: false,
        allow_unencrypted_assertion: false
    }
    const idp = new saml.IdentityProvider(idp_options);

    sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
        if (err != null) {
          console.log("Error: " + err);
          return res.send(500);
        } else {
          console.log("Login url: " + login_url);
          res.redirect(login_url);
        }
      });
}