const { extractToken, decodeToken } = require("../../utils/jwtUtils");

module.exports = async (req, res) => {
    const oidc = req.oidc;
    try {
        const interactionDetails = await oidc.interactionDetails(req, res);
        console.log("login controller - INTERACTION DETAILS - " + JSON.stringify(interactionDetails));

        // Get account
        let account;
        const token = extractToken(req);
        if (token) {
            account = decodeToken(token, process.env.JWT_SECRET)?.payload;
        }

        const result = {
            login: {
                accountId: account.email,
            },
        };
        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: false });

        // res.status(200).send(respObj);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}