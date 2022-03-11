const { extractToken, decodeToken } = require("../../utils/jwtUtils");

module.exports = async (req, res) => {
    const oidc = req.oidc;

    try {
        const interactionDetails = await oidc.interactionDetails(req, res);

        const { prompt: { name, details }, params, session: { accountId } } = interactionDetails;
        
        let { grantId } = interactionDetails;
        let grant;

        if (grantId) {
            // modifying existing grant in existing session
            grant = await oidc.Grant.find(grantId);
        } else {
            // establishing a new grant
            grant = new oidc.Grant({
            accountId,
            clientId: params.client_id,
            });
        }

        if (details.missingOIDCScope) {
            grant.addOIDCScope(details.missingOIDCScope.join(' '));
        }
        if (details.missingOIDCClaims) {
            grant.addOIDCClaims(details.missingOIDCClaims);
        }
        if (details.missingResourceScopes) {
            // eslint-disable-next-line no-restricted-syntax
            for (const [indicator, scopes] of Object.entries(details.missingResourceScopes)) {
            grant.addResourceScope(indicator, scopes.join(' '));
            }
        }

        grantId = await grant.save();

        const consent = {};
        if (!interactionDetails.grantId) {
            // modifying existing grantId
            consent.grantId = grantId;
        }

        const result = { consent };
        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });

        // No need to return response as oidc.interactionFinished handles that part

    } catch (err) {
        console.log(err);
        return (err);
    }
}