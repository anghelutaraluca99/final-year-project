const axios = require("axios");

module.exports = async (req, res) => {
  let cats = [];
  let headers = { "x-api-key": process.env.API_KEY };

  for (let i = 0; i < 30; i++) {
    cats.push(
      new Promise((resolve) => {
        axios.get("https://api.thecatapi.com/v1/images/search").then((cat) => {
          console.log("cats: ", cat);
          console.log("cat.data[0].url: ", cat.data[0].url);
          resolve(cat.data[0].url);
        });
      })
    );
  }
  const catsResp = await Promise.all(cats);
  console.log("CATS: ", catsResp);
  return res.status(200).send(catsResp);
};
