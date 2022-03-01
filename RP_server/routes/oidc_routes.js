const router = require("express").Router();
const { interaction } = require("../middlewares/oidc");
const {
   Interaction,
} = require("../controllers/oidc");

// Registration + authentication routes; traffic to these routes should not go through the middleware
router.use('/:uid', Interaction);
router.post('/:uid/login', Interaction);
router.post('/:uid/consent', Interaction);

module.exports = router;