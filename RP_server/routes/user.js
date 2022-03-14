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
  GetFingerprints,
} = require("../controllers/user");
const {
  PreAccountRecovery,
  AccountRecovery,
} = require("../controllers/user/RecoverAccount");

// Registration + authentication + account recovery routes; traffic to these routes should not go through the middleware
router.post("/pre_register", PostPreRegistration);
router.post("/register", PostRegistration);

router.post("/pre_authenticate", PostPreAuthentication);
router.post("/authenticate", PostAuthentication);

router.post("/pre_account_recovery", PreAccountRecovery);
router.post("/account_recovery", AccountRecovery);

// Middleware to check for JWT token
router.use("/", requireAuth);

// Rest of the traffic goes through the the middleware to check if user is authenticated
router.get("/authenticators", AuthenticatorsList);
router.post("/authenticators", DeleteAuthenticator);

router.post("/pre_register_new_authenticator", PreRegisterNewAuthenticator);
router.post("/register_new_authenticator", RegisterNewAuthenticator);

router.get("/fingerprints", GetFingerprints);
router.post("/validate_fingerprint", ValidateFingerprint);
router.post("/save_fingerprint", SaveFingerprint);

router.get("/", GetUser);

module.exports = router;
