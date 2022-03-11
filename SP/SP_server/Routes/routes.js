const router = require("express").Router();
const {
    Login, 
    Root,
} = require("../controllers");

// router.use('/', GenerateMetadata);
router.get("/login", Login);
router.get("/", Root);

module.exports = router;