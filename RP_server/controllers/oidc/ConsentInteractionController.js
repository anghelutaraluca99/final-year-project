const { extractToken, decodeToken } = require("../../utils/jwtUtils");

module.exports = async (req, res) => {
    const oidc = req.oidc;

    try {
        // let account;

        // const token = extractToken(req);
        // if (token) {
        //     account = decodeToken(token, process.env.JWT_SECRET)?.payload;

        const interactionDetails = await oidc.interactionDetails(req, res);
        console.log(JSON.stringify(interactionDetails));
        // const { prompt: { name, details }, params, session: { accountId } } = interactionDetailss;
        assert.equal(name, 'consent');

        console.log("uid: " + uid);
        console.log("params: " + JSON.stringify(params));
        console.log("session: " + session);

        return res.status(303).redirect(params.redirect_uri);

    } catch (err) {
        console.log(err);
        return (err);
    }
}