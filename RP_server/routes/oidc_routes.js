const router = require("express").Router();
const { interaction } = require("../middlewares/oidc");
const {
   Interaction,
   LoginInteraction,
   ConsentInteraction,
} = require("../controllers/oidc");

// Registration + authentication routes; traffic to these routes should not go through the middleware
router.get('/:uid', Interaction);
router.post('/:uid/login', LoginInteraction);
router.post('/:uid/consent', ConsentInteraction);

module.exports = router;