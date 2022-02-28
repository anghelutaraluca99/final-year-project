const { Issuer, generators } = require('openid-client');


module.exports = async (req, res) => {

  console.log("Root");
  res.status(200).send({pls:"work"});

}