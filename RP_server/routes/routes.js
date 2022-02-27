const router = require("express").Router();
const { requireAuth } = require("../middlewares");
const {
    PostRegistration,
    PostPreRegistration,
    PostAuthentication,
    PostPreAuthentication,
} = require("../controllers");

// Registration + authentication routes; traffic to these routes should not go through the middleware
router.post('/pre_register', PostPreRegistration);
router.post('/register', PostRegistration);

router.post('/pre_authenticate', PostPreAuthentication);
router.post('/authenticate', PostAuthentication);