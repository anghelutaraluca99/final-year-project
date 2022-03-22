const router = require("express").Router();
const routes = require("./routes");
const oidc_routes = require("./oidc_routes");

router.use("/", routes);
router.use("/oidc", oidc_routes);

module.exports = router;
