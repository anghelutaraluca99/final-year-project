const router = require("express").Router();
const {
  Login,
  Root,
  ValidateToken,
  GetCats,
  Logout,
} = require("../controllers");
const { requireAuth } = require("../middlewares");

router.get("/login", Login);
router.get("/", Root);
router.post("/access_token", ValidateToken);

// Protect GetDogs and logout behind the requireAuth middleware
router.use("/cats", requireAuth);
router.get("/cats", GetCats);
router.post("/logout", Logout);

module.exports = router;
