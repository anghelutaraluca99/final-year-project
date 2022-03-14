const url = require("url");
const { jwtUtils } = require("../utils");

module.exports = async (req, res) => {
  const code_verifier = req.signedCookies.code_verifier;
  let params = global.oidcClient.callbackParams(req);
  // let userinfo;
  let tokenSet;

  try {
    tokenSet = await global.oidcClient.callback(
      "http://localhost:4000/",
      params,
      { code_verifier }
    ); // to get access token and id token
    // userinfo = await global.oidcClient.userinfo(tokenSet.access_token); // to access user info
    // console.log(userinfo);
  } catch (e) {
    console.log(e);
    return res.status(500).send(e);
  }

  // const tokenPayload = {
  //   user: userinfo.sub,
  //   timestamp: Date.now(),
  // }; // construct token payload for JWT token
  // const token = await jwtUtils.createToken(
  //   tokenPayload,
  //   process.env.JWT_SECRET
  // ); // construct JWT token

  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");

  // if (userinfo) {
  // return res
  //   .status(302)
  //   .redirect(
  //     "http://localhost:4001/user/" +
  //       encodeURIComponent(userinfo.sub) +
  //       "/" +
  //       encodeURIComponent(token)
  //   );
  const returnURI =
    "http://localhost:4001/receiveOIDCToken/" +
    encodeURI(tokenSet.access_token);
  return res.status(200).send({ returnURI: returnURI });
  // }
};
