const { generators } = require("openid-client");

module.exports = async (req, res) => {
  const code_verifier = generators.codeVerifier();
  let options = {
    maxAge: 1000 * 3600 * 24,
    httpOnly: true, // The cookie only accessible by the web server
    signed: true, // Indicates if the cookie should be signed
    sameSite: "lax",
  };
  res.cookie("code_verifier", code_verifier, options); // options is optional
  const code_challenge = generators.codeChallenge(code_verifier);

  const url = global.oidcClient.authorizationUrl({
    scope: "openid email name username",
    code_challenge,
    code_challenge_method: "S256",
  });

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:4000");
  res.setHeader("origin", "http://localhost:4000");
  return res.status(302).redirect(url);
};
