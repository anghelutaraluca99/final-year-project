module.exports = async (req, res, next) => {

    const oidc = req.oidc;
    // console.log(oidc);
    try {
        // const {
        //   uid, prompt, params, session,
        // } = await oidc.interactionDetails(req, res);
        console.log("Entered middleware for oidc interactions");
        return next();
    } catch (err) {
        return next(err);
    }
}