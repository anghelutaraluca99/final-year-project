const express = require('express');
const cors = require('cors');

const{
    PostRegistration,
    PostPreRegistration,
    PostAuthentication,
    PostPreAuthentication
} = require("./controllers");

const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({origin: 'http://localhost:8080'}));
app.use(express.json());

// Routes
app.post('/pre_register', PostPreRegistration);
app.post('/register', PostRegistration);
app.post('/pre_authenticate', PostPreAuthentication);
app.post('/authenticate', PostAuthentication);

// Connect to database
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
