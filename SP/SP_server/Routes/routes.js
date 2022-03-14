const router = require("express").Router();
const { Login, Root, ValidateToken, GetDogs } = require("../controllers");
const { requireAuth } = require("../middlewares");

router.get("/login", Login);
router.get("/", Root);
router.post("/access_token", ValidateToken);

// Protect GetDogs behind the requireAuth middleware
router.use("/dogs", requireAuth);
router.get("/dogs", GetDogs);

module.exports = router;
