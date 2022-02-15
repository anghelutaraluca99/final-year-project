const saml = require('saml2-js');

module.exports = async (req, res) => {

var sp_options = {
    entity_id: "http://localhost:4000/metadata.xml",
    private_key: process.env.CERT,
    certificate: process.env.KEY,
    assert_endpoint: "http://localhost:3000/samlProvider",
    force_authn: true,
    auth_context: { comparison: "exact", class_refs: ["urn:oasis:names:tc:SAML:2.0:ac:classes:SmartcardPKI"]},
    nameid_format: "urn:oasis:names:tc:SAML:2.0:nameid-format:emailAddress",
    sign_get_request: false,
    allow_unencrypted_assertion: true
  }

  // Call service provider constructor with options
  var sp = new saml.ServiceProvider(sp_options);

  // Example use of service provider.
  // Call metadata to get XML metatadata used in configuration.
  var metadata = sp.create_metadata();
  console.log(metadata);
  console.log("Reached controller");
  res.send()
}
