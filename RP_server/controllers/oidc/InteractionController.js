const {usersQueries, authenticatorsQueries} = require("../../models/database_queries");

module.exports = async (req, res) => {
    const oidc = req.oidc;
    try {
        const {
          uid, prompt, params, session,
        } = await oidc.interactionDetails(req, res);
        
        console.log("uid: " + uid);
        console.log("prompt: " + prompt);
        console.log("prompt.name: " + prompt.name);
        console.log("params: " + params);
        console.log("params.client_id: " + params.client_id);
        console.log("session: " + session);
        // const client = await provider.Client.find(params.client_id);
        // if(prompt.name === 'login')
        //     return res.redirect('http://localhost:8080/oidc_interaction/' + uid + '/login');

        // if(prompt.name === 'consent')
        // return res.redirect('http://localhost:8080/oidc_interaction/' + uid + '/consent');

        return res.redirect('http://localhost:8080/oidc_interaction/' + uid);

    } catch (err) {
        return (err);
    }
}