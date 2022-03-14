const axios = require("axios");

module.exports = async (req, res) => {
  let dogs = [];

  for (let i = 0; i < 9; i++) {
    dogs.push(
      new Promise((resolve) => {
        axios.get("https://dog.ceo/api/breeds/image/random").then((dog) => {
          console.log("dog.data.message: ", dog.data.message);
          resolve(dog.data.message);
        });
      })
    );
  }
  const dogsResp = await Promise.all(dogs);
  console.log("DOGS: ", dogsResp);
  return res.status(200).send(dogsResp);
};
