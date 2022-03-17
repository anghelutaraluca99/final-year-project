const jwt = require("jsonwebtoken");

exports.createToken = function (payload, secret) {
  //sign the received payload with a secret in order to obtain the token
  return new Promise(function (resolve, reject) {
    jwt.sign({ payload }, secret, { expiresIn: "30d" }, function (err, token) {
      if (err) reject(err);
      resolve(token);
    });
  });
};

exports.extractToken = function (req) {
  // check for the authorization header
  const token = req.get("Authorization");
  if (
    token &&
    // check the header for 'Bearer' and split at ' '
    token.split(" ")[0] === "Bearer"
  ) {
    // return the token
    return token.split(" ")[1];
  }
  return null;
};

exports.decodeToken = function (token, secret) {
  try {
    // check the validity of the token
    // if successful, return the decrypted value of the token
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
