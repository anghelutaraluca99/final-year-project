const router = require("express").Router();
const { Root, ValidateToken } = require("../controllers");

// Routes used to support SSO fuctionality
router.get("/", Root);
router.post("/access_token", ValidateToken);

module.exports = router;
