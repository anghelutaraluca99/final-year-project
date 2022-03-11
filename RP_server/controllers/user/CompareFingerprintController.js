const {fingerprintsQueries} = require("../../models/database_queries");
const { fingerprints } = require("../../models/schemas");


const compObjects = require("../../utils/compObjects");

module.exports = async (req, res) => {
  try {
    const email = req.user.email;
    const fingerprint = req.body;
    const existing_fingerprints = await fingerprintsQueries.getFingerprints(email);
    
    let comp_result;

    for (let i = 0; i < existing_fingerprints.length; i++) {
      console.log("----------------Difference fingerprint " + i + " and given fingerprint: ");
      let fingerprint_1 = fingerprints[i].components;
      let fingerprint_2 = fingerprint.components;
      comp_result = compObjects(fingerprint_1, fingerprint_2);
      console.log(comp_result);
    }

    res.status(200).send();
  } catch(e) {
    console.log(e);
    req.status(500).send();
  }
}