const { Issuer, generators } = require('openid-client');


module.exports = async (req, res) => {

  const issuer = await Issuer.discover('http://localhost:3000/oidc');

  // console.log(issuer);

  const client = new issuer.Client({
    client_id: 'DEMO client',
    redirect_uris: ['https://192.168.1.111:4001'],
    response_types: ['id_token'],
  });

  const nonce = generators.nonce();

  const url = client.authorizationUrl({
    scope: ' email ',
    response_mode: 'form_post',
    nonce,
  });
  
  console.log(url);

  return res.status(302).redirect(url);
}