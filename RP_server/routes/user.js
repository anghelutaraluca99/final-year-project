const router = require("express").Router();
const samlProvider = require("samlp");
const { requireAuth } = require("../middlewares");
const {
    PostRegistration,
    PostPreRegistration,
    PostAuthentication,
    PostPreAuthentication,
    GetUser,
} = require("../controllers");

router.post('/pre_register', PostPreRegistration);
router.post('/register', PostRegistration);
router.post('/pre_authenticate', PostPreAuthentication);
router.post('/authenticate', PostAuthentication);

// Middlewares
router.use('!/samlProvider', requireAuth);
router.get('/', GetUser);
router.get('/samlProvider', samlProvider.auth({
    issuer: "http://localhost/3000",
    cert: process.env.CERT,
    key: process.env.KEY,
    getPostURL: function (wtrealm, wreply, req, callback) {
        return callback( null, 'http://localhost/3000')
      }
}));


module.exports = router;