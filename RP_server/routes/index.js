const router = require("express").Router();
const user_routes = require("./user");
const oidc_routes = require("./oidc_routes");

router.use("/oidc_interaction", oidc_routes);
router.use("/", user_routes);

module.exports = router;