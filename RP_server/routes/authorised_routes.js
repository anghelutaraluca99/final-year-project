const router = require("express").Router();
const { requireAuth } = require("../middlewares");
const {
    GetUser,
    AuthenticatorsList,
    DeleteAuthenticator,
    PreRegisterNewAuthenticator,
    RegisterNewAuthenticator,
    Services,
    SAMLAssertion,
} = require("../controllers");


// Middleware to check for JWT token - user logged in
router.use('/', requireAuth);

router.get('/authenticators', AuthenticatorsList);
router.post('/authenticators', DeleteAuthenticator);
router.post('/pre_register_new_authenticator', PreRegisterNewAuthenticator);
router.post('/register_new_authenticator', RegisterNewAuthenticator);
router.get('/services', Services); // lists available services
router.get('/saml_assertion', SAMLAssertion); // gets saml assertion
router.get('/', GetUser);



module.exports = router;