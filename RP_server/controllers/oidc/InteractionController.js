module.exports = async (req, res) => {
    const oidc = req.oidc;
    try {
        const interactionDetails = await oidc.interactionDetails(req, res);
        const {uid, prompt, params, session,} = interactionDetails;
        
        if(prompt?.name === "consent") {
            let resp = {
                message: "OIDC login successful!",
                uid: uid,
            }
            return res.status(200).send(resp);
        }
        else 
            return res.status(303).redirect(`http://localhost:8080/oidc_interaction/${uid}/${prompt?.name}`);
    } catch (err) {
        return (err);
    }
}