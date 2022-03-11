const { extractToken, decodeToken } = require("../../utils/jwtUtils");

module.exports = async (req, res) => {
    const oidc = req.oidc;
    try {
        const interactionDetails = await oidc.interactionDetails(req, res);

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

        // No need to return response as oidc.interactionFinished handles that part

    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
}