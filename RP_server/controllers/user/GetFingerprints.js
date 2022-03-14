const { fingerprintsQueries } = require("../../models/database_queries");

module.exports = async (req, res) => {
  try {
    const email = req.user.email;

    // Get all observed fingerprints for a user
    const existing_fingerprints = await fingerprintsQueries.getFingerprints(
      email
    );

    let unique_fingerprints = [];

    // Extract all unique fingerprints
    if (existing_fingerprints) {
      // Go through all recorded fingerprints
      for (let i = 0; i < existing_fingerprints.fingerprints.length; i++) {
        // Set current fingerprint to be checked; assume not in list
        let current_fingerprint = existing_fingerprints.fingerprints[i];
        let already_in_list = false;

        // check if current fingerprint exists in unique_fingerprints
        if (unique_fingerprints?.length > 0) {
          // Go through all found unique fingerprints
          for (let j = 0; j < unique_fingerprints.length; j++) {
            // Check if current fingerprint matches any found unique fingerprint
            if (
              current_fingerprint.visitorId === unique_fingerprints[j].visitorId
            ) {
              // Matches is true; update times_observed, already_in_list,
              unique_fingerprints[j].times_observed++;
              already_in_list = true;
              // Update timestamp to display the last used timestamp
              if (
                current_fingerprint.timestamp -
                  unique_fingerprints[j].lastUsed >
                0
              ) {
                unique_fingerprints[j].lastUsed = current_fingerprint.timestamp;
              }
              break;
            }
          }

          // If current fingerprint was not found in unique fingerprints
          if (!already_in_list) {
            let add_fingerprint = {
              visitorId: current_fingerprint.visitorId,
              times_observed: 1,
              lastUsed: current_fingerprint.timestamp,
            };
            unique_fingerprints.push(add_fingerprint);
          }
        } else {
          // Unique fingerprints list is empty, so automatically add fingerprint
          let add_fingerprint = {
            visitorId: current_fingerprint.visitorId,
            times_observed: 1,
            lastUsed: current_fingerprint.timestamp,
          };
          unique_fingerprints.push(add_fingerprint);
        }
      }

      return res.status(200).send({
        message: "Fingreprints retrieved successfully",
        fingerprints: unique_fingerprints,
      });
    } else {
      // No records are available
      return res
        .status(401)
        .send({ error: "No fingerprints registered with your account." });
    }
  } catch (e) {
    // Error
    return res
      .status(500)
      .send({ error: "Fingerprints could not be retrieved." });
  }
};
