const { Issuer, generators } = require('openid-client');
const axios = require('axios');


module.exports = async (req, res) => {
  // try{
  console.log("Root");
  console.log("Cookies: ", JSON.stringify(req.cookies, 0, 2));
  console.log("Cookies(signed): ", JSON.stringify(req.signedCookies, 0, 2));
  const code_verifier = req.signedCookies.code_verifier;
  let params = global.oidcClient.callbackParams(req);
  console.log('Params', JSON.stringify(params, 0, 2));
  try {
    // const formUrlEncode = (value) => encodeURIComponent(value).replace(/%20/g, '+');
    // const encoded = `${formUrlEncode(oidcClient.client_id)}:${formUrlEncode(oidcClient.client_secret)}`;
    // const params = new URLSearchParams();
    // params.append('client_id', oidcClient.client_id);
    // params.append('client_secret', oidcClient.client_secret);
    // const value = Buffer.from(encoded).toString('base64');
    // console.log(value);
    // const tokenSet = await axios.post('http://localhost:3000/oidc/token', {
    //   // method: 'post',
    //   headers: {
    //       // 'Accept': 'application/json',
    //       'Authorization' : `Basic ${value}`,
    //       "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   params,
    //   body: JSON.stringify(params),
    // });

    // console.log('--------------------------',tokenSet);
    const tokenSet = await global.oidcClient.callback('http://localhost:4000/', params, { code_verifier });
    console.log('received and validated tokens %j', tokenSet);
    console.log('validated ID Token claims %j', tokenSet.claims());
    const userinfo = await global.oidcClient.userinfo(tokenSet.access_token);
    console.log('--!user info:', userinfo);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
  res.status(200).send({pls:"work"});
  // }catch(e){
  //   console.log(JSON.stringify(e, 0, 2));
  //   res.status(400).send(e);
  // }
}