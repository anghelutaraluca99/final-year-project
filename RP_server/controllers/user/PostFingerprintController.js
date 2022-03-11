const {fingerprintsQueries} = require("../../models/database_queries");
const { compObjects, compResults } = require("../../utils");

module.exports = async (req, res) => {
  try {
    const email = req.user.email;
    const fingerprint = req.body;
    const response = await fingerprintsQueries.addFingerprint(email, fingerprint);


    // REMOVE FROM HERE; MOVE TO COMPARE_FINGERPRINTS_CONTROLLER
    const existing_fingerprints = await fingerprintsQueries.getFingerprints(email);

    for (let i = 0; i < existing_fingerprints.fingerprints.length; i++) {

      console.log("----------------Difference fingerprint " + i + " and given fingerprint: ");
      let comp_results = compObjects(existing_fingerprints.fingerprints[i], fingerprint)
      console.log("~~~~~~~~~~~~~~~~Comp results: " + JSON.stringify(comp_results));
      let comp_results_refined = compResults(comp_results);
      console.log("~~~~~~~~~~~~~~~~Comp results refined: " +  JSON.stringify(comp_results_refined));
      

      // Comparison does not work as duration for each component is different, although conponents are the same ?
    }
    res.status(200).send({message: "Fingerprint added successfully!"});
  } catch(e) {
    console.log(e);
    req.status(500).send({error: "Fingerprint could not be saved."});
  }
}