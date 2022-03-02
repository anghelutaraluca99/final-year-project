module.exports = async (req, res) => {
    const oidc = req.oidc;
    try {
        const {
            uid, prompt, params, session,
        } = await oidc.interactionDetails(req, res);
        
        console.log("uid: " + uid);
        console.log("prompt: " + JSON.stringify(prompt));
        console.log("params: " + JSON.stringify(params));
        console.log("session: " + session);

        return res.redirect('http://localhost:8080/oidc_interaction/' + uid);

    } catch (err) {
        return (err);
    }
}