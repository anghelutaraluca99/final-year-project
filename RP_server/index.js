const express = require('express');
const cors = require('cors');
const {GetAuth} = require('./GetAuthController');
const {PostAuth} = require('./PostAuthController');
const {GetRegistration} = require('./GetRegistrationController');
const {PostRegistration} = require('./PostRegistrationController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({origin: 'http://localhost:8080'}));
app.use(express.json());

app.get('/register', GetRegistration);
app.post('/register', PostRegistration);
app.get('/authenticate', GetAuth);
app.post('/authenticate', PostAuth);

app.listen(
    PORT,
    () => console.log(`Server live at http://localhost:${PORT}`)
);









