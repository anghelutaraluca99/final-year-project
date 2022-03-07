const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FingerprintSchema = new Schema(
    {
        userID: {
            type: "string",
        },
        // stores the fingerprint as JSON string
        fingerprints : [
          { 
            // data: {
            //   type: "string"
            // },
            
              type: "Object"
            
            // timestamp : {
            //   type: "date"
            // },
          }

        ],
        
    },
);

const fingerprints = mongoose.model("fingerprints", FingerprintSchema);

module.exports = fingerprints;