const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const { Provider } = require('oidc-provider');
const router = require("./routes");

// Open ID Connect Identity Provider
const configuration = {
    // ... see /docs for available configuration
    clients: [{
      client_id: 'foo',
      client_secret: 'bar',
      redirect_uris: ['http://localhost:8080/oidc'],
      // ... other client properties
    }],
  };
const oidc = new Provider('http://localhost:3000', configuration, {
    async findAccount(ctx, id) {
      return {
        accountId: id,
        async claims(use, scope) { return { sub: id }; },
      };
    }
  });

// Middlewares
app.use(cors({origin: 'http://localhost:8080'}));
app.use(cors());
app.use(express.json());
app.use("/oidc", oidc.callback());

// Routes
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
