const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const router = require("./routes");
const { Issuer } = require("openid-client");
const PORT = process.env.PORT || 4000;

// Middlewares
const whitelist = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:4000",
  "http://localhost:4001",
  null,
  undefined,
];
// const corsOptions = {
//   origin: whitelist,
//   credentials: true,
// };
const corsOptions = {
  origin: function (origin, callback) {
    if (origin === undefined) {
      // ORIGIN is SP_client
      console.log("origin undefined");
      callback(null, { origin: "http://localhost:4001" });
    } else {
      if (origin === null) {
        console.log("origin null");
        callback(null, { origin: "http://localhost:8080" });
      } else {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          // ORIGIN of redirect coming from DP_client is null and undefined?
          callback(null, { origin });
        } else {
          console.log("SP_Origin error: ", origin);
          callback(null, { origin: "http://localhost:8080" });
        }
      }
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  // req.headers.origin = req.headers.origin || req.headers.host;
  console.log("%%%%%%%% ", res.headers);
  next();
});
app.use(express.json());
app.use(cookieParser("secret"));

Issuer.discover("http://localhost:3000/oidc").then((issuer) => {
  const oidcClient = new issuer.Client({
    client_id: "Dogs As A Service",
    client_secret: "secret",
    redirect_uris: ["http://localhost:4000/"],
    response_types: ["code"],
  });
  global.oidcClient = oidcClient;
});

// Routes // TODO - define routes
app.use("/", router);

app.listen(PORT, () => console.log(`Server live at http://localhost:${PORT}`));

// Connection to database
// mongoose.connect(process.env.DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log(`Connected to database.`);
// Start listening
// app.listen(
//     PORT,
//     () => console.log(`Server live at http://localhost:${PORT}`)
// );
// });
