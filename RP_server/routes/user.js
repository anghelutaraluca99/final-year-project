const router = require("express").Router();
const { requireAuth } = require("../middlewares/user");
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
  Fingerprint,
  ValidateFingerprint,
  SaveFingerprint,
} = require("../controllers/user");

// Registration + authentication routes; traffic to these routes should not go through the middleware
router.post("/pre_register", PostPreRegistration);
router.post("/register", PostRegistration);

router.post("/pre_authenticate", PostPreAuthentication);
router.post("/authenticate", PostAuthentication);

// Middleware to check for JWT token
router.use("/", requireAuth);

// Rest of the traffic goes through the the middleware to check if user is authenticated
router.get("/authenticators", AuthenticatorsList);
router.post("/authenticators", DeleteAuthenticator);

router.post("/pre_register_new_authenticator", PreRegisterNewAuthenticator);
router.post("/register_new_authenticator", RegisterNewAuthenticator);

router.post("/fingerprint", Fingerprint);
router.post("/validate_fingerprint", ValidateFingerprint);
router.post("/save_fingerprint", SaveFingerprint);

router.get("/", GetUser);

module.exports = router;
