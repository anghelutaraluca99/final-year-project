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
} = require("../controllers");

// Registration routes; traffic to these routes should nto go through the middleware
router.post('/pre_register', PostPreRegistration);
router.post('/register', PostRegistration);

// Middleware to check for JWT token
router.use('/', requireAuth);

router.get('/', GetUser);
router.post('/pre_authenticate', PostPreAuthentication);
router.post('/authenticate', PostAuthentication);
router.get('/authenticators', AuthenticatorsList);
router.post('/authenticators', DeleteAuthenticator);

router.get('/samlProvider', samlProvider.auth({
    issuer: "http://localhost/3000",
    cert: process.env.CERT,
    key: process.env.KEY,
    getPostURL: function (wtrealm, wreply, req, callback) {
        return callback( null, 'http://localhost/3000')
      }
}));


module.exports = router;