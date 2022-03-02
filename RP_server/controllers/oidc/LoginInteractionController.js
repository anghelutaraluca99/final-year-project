const { extractToken, decodeToken } = require("../../utils/jwtUtils");

module.exports = async (req, res) => {
    const oidc = req.oidc;

    // try {
        const { prompt: { name } } = await oidc.interactionDetails(req, res);
        assert.equal(name, 'login');

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
    // } catch (err) {
    //     return res.status(500).send(err);
    // }
}