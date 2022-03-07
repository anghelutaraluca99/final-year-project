module.exports = async (req, res) => {

  const code_verifier = req.signedCookies.code_verifier;
  let params = global.oidcClient.callbackParams(req);
  
  try {
    const tokenSet = await global.oidcClient.callback('http://localhost:4000/', params, { code_verifier }); // to get access token and id token
    const userinfo = await global.oidcClient.userinfo(tokenSet.access_token); // to access user info
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
  res.status(200).send({pls:"work"});
}