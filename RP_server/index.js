const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const { Provider } = require('oidc-provider');
const router = require("./routes");
const configurationOidc = require('./oidc/configuration/oidc_config');

// Open ID Connect Identity Provider
// const configuration = {
//     // ... see /docs for available configuration
//     clients: [{
//       client_id: 'development-implicit',
//       application_type: 'web',
//       token_endpoint_auth_method: 'none',
//       response_types: ['id_token'],
//       grant_types: ['implicit'],
//       redirect_uris: ['http://localhost:8080'], // this fails two regular validations http: and localhost
//     }],
//     claims: {
//       address: ['address'],
//       email: ['email'],
//       profile: ['name'],
//     },
//     interactions: {
//       url(ctx, interaction) { // eslint-disable-line no-unused-vars
//         return `http://localhost:8080/interaction/${interaction.uid}`;
//       },
//     },
//     features: {
//       devInteractions: { enabled: false }
//     },
//   };
const oidc = new Provider('http://localhost:3000', configurationOidc);

// Middlewares
const whitelist = ['http://localhost:8080', 'http://localhost:4000'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/oidc", oidc.callback());
app.use("/", router);

// Connection to database
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`Connected to database.`);
// Start listening
    app.listen(
        PORT,
        () => console.log(`Server live at http://localhost:${PORT}`)
    );
});
