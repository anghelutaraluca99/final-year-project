const router = require("express").Router();
const {
    Login, 
    Root,
    CallbackTokenExchange,
} = require("../controllers");

// router.use('/', GenerateMetadata);
router.get("/login", Login);
router.get("/", Root);
router.get("/cb_token_exchange", CallbackTokenExchange);

module.exports = router;