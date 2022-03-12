const { generators } = require('openid-client');


module.exports = async (req, res) => {

  const code_verifier = generators.codeVerifier();
  let options = {
    maxAge: 1000 * 3600 * 24, // would expire after 15 minutes
    httpOnly: true, // The cookie only accessible by the web server
    signed: true, // Indicates if the cookie should be signed
    sameSite: 'lax',
  } 
  res.cookie('code_verifier', code_verifier, options); // options is optional
  const code_challenge = generators.codeChallenge(code_verifier);

  const url = global.oidcClient.authorizationUrl({
    scope: 'openid email',
    code_challenge,
    code_challenge_method: 'S256',
  });

  console.log(url)

  return res.status(302).redirect(url);
}