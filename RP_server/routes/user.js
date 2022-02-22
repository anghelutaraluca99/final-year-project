const router = require("express").Router();
const samlProvider = require("samlp");
const { requireAuth } = require("../middlewares");
const {
    PostRegistration,
    PostPreRegistration,
    PostAuthentication,
    PostPreAuthentication,
    GetUser,
    AuthenticatorsList,
    DeleteAuthenticator,
    PreRegisterNewAuthenticator,
    RegisterNewAuthenticator,
} = require("../controllers");

// Registration + authentication routes; traffic to these routes should not go through the middleware
router.post('/pre_register', PostPreRegistration);
router.post('/register', PostRegistration);

router.post('/pre_authenticate', PostPreAuthentication);
router.post('/authenticate', PostAuthentication);


router.get('/samlProvider', samlProvider.auth({
    issuer: "http://localhost/3000",  
    cert: process.env.CERT,
    key: process.env.KEY,
    getPostURL: function (wtrealm, wreply, req, callback) {
        return callback( null, 'http://localhost/3000')
      }
}));

// Middleware to check for JWT token
router.use('/', requireAuth);

router.get('/', GetUser);
router.get('/authenticators', AuthenticatorsList);
router.post('/authenticators', DeleteAuthenticator);
router.post('/pre_register_new_authenticator', PreRegisterNewAuthenticator);
router.post('/register_new_authenticator', RegisterNewAuthenticator);




module.exports = router;