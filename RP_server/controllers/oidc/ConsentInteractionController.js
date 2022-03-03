const { extractToken, decodeToken } = require("../../utils/jwtUtils");

module.exports = async (req, res) => {
    const oidc = req.oidc;

    try {
        const interactionDetails = await oidc.interactionDetails(req, res);
        console.log("Consent controller - INTERACTION DETAILS - " + JSON.stringify(interactionDetails));

        const { prompt: { name, details }, params, session: { accountId } } = interactionDetails;
        
        let { grantId } = interactionDetails;
        let grant;

        if (grantId) {
            // we'll be modifying existing grant in existing session
            grant = await oidc.Grant.find(grantId);
        } else {
            // we're establishing a new grant
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
            // we don't have to pass grantId to consent, we're just modifying existing one
            consent.grantId = grantId;
        }

        const result = { consent };
        console.log('--- consent result before int finished', JSON.stringify(grant,0,2));
        await oidc.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
        console.log('---consent interaction finished');

    } catch (err) {
        console.log(err);
        return (err);
    }
}