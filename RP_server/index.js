const express = require('express');
const cors = require('cors');
const {GetReg} = require('./GetRegController');
const {PostReg} = require('./PostRegController');
const {GetAuth} = require('./GetAuthController');
const {PostAuth} = require('./PostAuthController');
const WebAuthn = require('webauthn');


// TODO :: uncomment to use webauthn
// const webauthn = new WebAuthn({
//     origin: 'http://localhost:3000',
//     usernameField: 'username',
//     userFields: {
//         username: 'username',
//         name: 'displayName',
//     },
//     store: new LevelAdapter(),
//     rpName: 'Stranger Labs, Inc.',
//     enableLogging: false,
// })

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors({origin: 'http://localhost:3000'}));
app.use(express.json());
// Mount webauthn endpoints TODO :: uncomment to use webauthn
// app.use('/webauthn', webauthn.initialize())


// Endpoint without passport TODO :: uncomment to use webauthn
// app.get('/secret', webauthn.authenticate(), (req, res) => {
//     res.status(200).json({ status: 'ok', message: 'Super Secret!' })
// })
app.get('/register', GetReg);
app.post('/register', PostReg);
app.get('/authenticate', GetAuth);
app.post('/authenticate', PostAuth);

app.listen(
    PORT,
    () => console.log(`Server live at http://localhost:${PORT}`)
);









