module.exports = async (req, res) => {
    const oidc = req.oidc;
    try {
        const interactionDetails = await oidc.interactionDetails(req, res);
        const {uid, prompt, params, session,} = interactionDetails;
        
        console.log("Interaction controller - INTERACTION DETAILS - " + JSON.stringify(interactionDetails));

        if(prompt?.name === "consent") {
            let resp = {
                message: "OIDC login successful!",
                uid: uid,
            }
            return res.status(200).send(resp);
        }
        else return res.status(303).redirect(`http://localhost:8080/oidc_interaction/${uid}`);
        console.log('-------------trying to change cors-------------------');
        // res.setHeader("Access-Control-Allow-Origin", 'http://localhost:8080');
        // res.setHeader("Access-Control-Allow-Credentials", false);
        // console.log(res);
        global.interactionRedirects++;
        console.log('--------interaction redirect no ', global.interactionRedirects);
        const respData = {
            redirect: `http://localhost:8080/oidc_interaction/${uid}`
        }
        // return res.status(200).send(respData);
        // return res.status(303).redirect(`http://localhost:8080/oidc_interaction/${uid}`);

    } catch (err) {
        return (err);
    }
}