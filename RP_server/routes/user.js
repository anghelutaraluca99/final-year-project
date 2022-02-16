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

// Middlewares
// router.use('!/samlProvider', requireAuth);
router.use('/', requireAuth);
router.get('/', GetUser);

router.post('/pre_register', PostPreRegistration);
router.post('/register', PostRegistration);
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