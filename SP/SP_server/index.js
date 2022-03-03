const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config();
const router = require("./routes");
const { Issuer } = require("openid-client");
const PORT = process.env.PORT || 4000;

// Middlewares
// app.use(cors({origin: 'http://localhost:4001'}));
const whitelist = ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4000', 'http://localhost:4001'];
const corsOptions = {
  origin: function (origin, callback) {
    console.log("Origin: " + origin);
    if (whitelist.indexOf(origin) !== -1 || !origin || origin === "null") {
// ORIGIN of redirect coming from DP_client is null and undefined? 
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser("secret"));

// let oidcClient = null;
Issuer.discover('http://localhost:3000/oidc').then((issuer) => {
    // console.log(issuer);
    const oidcClient = new issuer.Client({
        client_id: 'DEMO client',
        client_secret: 'secret',
        redirect_uris: ['http://localhost:4000/'],
        response_types: ['code'],
        // // id_token_signed_response_alg (default "RS256")
        // // token_endpoint_auth_method (default "client_secret_basic")
    });
    global.oidcClient = oidcClient;
    // app.use('/', (req, res, next) => {
    //     req.oidcClient = oidcClient;
    //     return next();
    // });
});


// Routes // TODO - define routes
app.use("/", router);

app.listen(
    PORT,
    () => console.log(`Server live at http://localhost:${PORT}`)
);


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