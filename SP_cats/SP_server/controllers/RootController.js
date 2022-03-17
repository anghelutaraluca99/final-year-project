const url = require("url");
const { jwtUtils } = require("../utils");

module.exports = async (req, res) => {
  const code_verifier = req.signedCookies.code_verifier;
  let params = global.oidcClient.callbackParams(req);
  // let userinfo;
  let tokenSet;

  try {
    tokenSet = await global.oidcClient.callback(
      "http://localhost:5000/",
      params,
      { code_verifier }
    ); // to get access token and id token
    // userinfo = await global.oidcClient.userinfo(tokenSet.access_token); // to access user info
    console.log("!+!+!+!+!+!+!+ TOKEN SET: ", JSON.stringify(tokenSet, 0, 2));
    // console.log(userinfo);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }
  const returnURI =
    "http://localhost:5001/receiveOIDCToken/" +
    encodeURI(tokenSet.access_token);
  return res.status(200).send({ returnURI: returnURI });
  // }
};
