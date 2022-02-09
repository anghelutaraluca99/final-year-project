const router = require("express").Router();
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

router.use('/', requireAuth);
router.get('/', GetUser);

module.exports = router;