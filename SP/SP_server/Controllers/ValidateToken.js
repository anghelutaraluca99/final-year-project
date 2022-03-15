const url = require("url");
const { jwtUtils } = require("../utils");

module.exports = async (req, res) => {
  let access_token = req.body.access_token;
  let userinfo;

  try {
    // to get access token and id token
    userinfo = await global.oidcClient.userinfo(access_token); // to access user info
    console.log(userinfo);
  } catch (e) {
    console.log(e);
    return res
      .status(401)
      .send({ error: "Access token could not be validated." });
  }

  const tokenPayload = {
    user: userinfo,
    access_token: access_token,
  }; // construct token payload for JWT token
  const token = await jwtUtils.createToken(
    tokenPayload,
    process.env.JWT_SECRET
  ); // construct JWT token

  return res.status(200).send({
    message: `User ${userinfo.sub} registered successfully!`,
    token: token,
    user: userinfo,
  });
};
