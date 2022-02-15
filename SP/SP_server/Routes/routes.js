const router = require("express").Router();
const {
    Login, 
    GenerateMetadata, 
    Assert
} = require("../controllers");

// router.use('/', GenerateMetadata);
router.get("/metadata.xml", GenerateMetadata);
router.get("/login", Login);
router.post("/assert", Assert);

module.exports = router;