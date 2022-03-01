const { Issuer, generators } = require('openid-client');


module.exports = async (req, res) => {

  const issuer = await Issuer.discover('http://localhost:3000/oidc');

  // Implicit flow; not available for use with localhost and http

  // const client = new issuer.Client({
  //   client_id: 'DEMO client',
  //   redirect_uris: ['https://192.168.1.111:4001'],
  //   response_types: ['id_token'],
  // });

  // const nonce = generators.nonce();

  // const url = client.authorizationUrl({
  //   scope: ' email ',
  //   response_mode: 'form_post',
  //   nonce,
  // });
  
  // console.log(url);

  const client = new issuer.Client({
    client_id: 'DEMO client',
    client_secret: 'secret',
    redirect_uris: ['http://localhost:4000/'],
    response_types: ['code'],
    // // id_token_signed_response_alg (default "RS256")
    // // token_endpoint_auth_method (default "client_secret_basic")
  });

  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);

  const url = client.authorizationUrl({
    scope: 'email',
    code_challenge,
    code_challenge_method: 'S256',
  });

  console.log(url)

  return res.status(302).redirect(url);
}