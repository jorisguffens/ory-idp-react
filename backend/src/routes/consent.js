const {hydraClient} = require('../config');

function createHydraSession(requestedScope, context) {
    const verifiableAddresses = context.identity.verifiable_addresses || []
    if ( requestedScope.indexOf('email') === -1 || verifiableAddresses.length === 0 ) {
        return {}
    }
    return {
        id_token: {
            email: verifiableAddresses[0].value
        }
    }
}

async function consent(req, res, next) {
    try {
        const hydraChallenge = req.query.consent_challenge;

        if ( !hydraChallenge ) {
            throw new Error("No valid OAuth session started.");
        }

        const {data: body} = await hydraClient.getConsentRequest(hydraChallenge);

        // skip consent & accept consent request
        if (body.skip) {
            const acceptConsentRequest = {
                grant_scope: body.grant_scope,
                grant_access_token_audience: body.requested_access_token_audience,
                session: createHydraSession(body.requested_scope, body.context)
            };

            const result = await hydraClient.acceptConsentRequest(hydraChallenge, acceptConsentRequest);
            res.redirect(result.data.redirect_to);
            return;
        }

        res.redirect(process.env.APP_URI + "/auth/consent");
    } catch (err) {
        next(err);
    }
}

async function finishConsent(req, res, next) {

}

module.exports = {
    consent,
    finishConsent
}