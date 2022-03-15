const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const { Provider } = require("oidc-provider");
const router = require("./routes");
const configurationOidc = require("./oidc/configuration/oidc_config");
global.interactionRedirects = 0;
global.loginRedirects = 0;

// Open ID Connect Identity Provider
const oidc = new Provider("http://localhost:3000", configurationOidc);

// MIDDLEWARES

// CORS middleware
const whitelist = [
  "http://localhost:3000",
  "http://localhost:8080",
  "http://localhost:4000",
  "http://localhost:4001",
  null,
  undefined,
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      console.log("RP_Origin: ", origin);
      callback(null, { origin: true });
    } else {
      callback(null, { origin: false });
      // callback(new Error("Origin " + origin + " not allowed by CORS"), {
      //   origin: false,
      // });
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Middleware to set Access-Control-Allow-Origin header
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  next();
});

// Middlewares to parse json and cookies
app.use(express.json());
app.use(cookieParser());

// Middleware to pass oidc as object
app.use("/oidc_interaction", (req, res, next) => {
  req.oidc = oidc;
  next();
});

// Routes
app.use("/oidc", cors(corsOptions), oidc.callback());
app.use("/", router);

// Connection to database
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to database.`);
    // Start listening
    app.listen(PORT, () =>
      console.log(`Server live at http://localhost:${PORT}`)
    );
  });
