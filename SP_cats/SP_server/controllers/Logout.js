const { generators } = require("openid-client");
const {
  cookies,
} = require("../../../RP_server/oidc/configuration/oidc_config");

module.exports = async (req, res) => {
  res.cookie("_session", "", { maxAge: 10, httpOnly: true });
  res.cookie("_session.sig", "", { maxAge: 10, httpOnly: true });
  res.cookie("code_verifier", "", { maxAge: 10, httpOnly: true });

  res.status(200).send();
};
