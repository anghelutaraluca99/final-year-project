const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const{
    PostRegistration,
    PostPreRegistration,
    PostAuthentication,
    PostPreAuthentication
} = require("./controllers");
const { requireAuth } = require("./middlewares");
const router = require("./routes");

// Middlewares
// app.use(cors({origin: 'http://localhost:8080'}));
app.use(cors());
app.use(express.json());

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
