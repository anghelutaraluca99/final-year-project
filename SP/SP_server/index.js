const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const router = require("./routes");
const PORT = process.env.PORT || 4000;

// Middlewares
// app.use(cors({origin: 'http://localhost:4001'}));
app.use(cors());
app.use(express.json());

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