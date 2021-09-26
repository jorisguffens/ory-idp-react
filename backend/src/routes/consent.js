const {hydraClient} = require('../config');
const crypto = require("crypto");

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

        req.session.hydraConsentChallenge = hydraChallenge;
        res.redirect(process.env.APP_URI + "/auth/consent");
    } catch (err) {
        next(err);
    }
}

async function consentInfo(req, res, next) {
    try {
        if ( !req.session.hydraConsentChallenge ) {
            throw new Error("No valid OAuth session started.");
        }

        const hydraChallenge = req.session.hydraConsentChallenge;
        const {data: body} = await hydraClient.getConsentRequest(hydraChallenge);

        const result = {
            requested_scope: body.requested_scope,
            requested_access_token_audience: body.requested_access_token_audience,
            client: {
                logo_uri: body.client.logo_uri,
                client_id: body.client.client_id,
                client_name: body.client.client_name,
                policy_uri: body.client.policy_uri,
                tos_uri: body.client.tos_uri
            }
        }

        res.json(result);
    } catch(err) {
        next(err);
    }
}

async function consentFinish(req, res, next) {
    try {
        if ( !req.session.hydraConsentChallenge ) {
            throw new Error("No valid OAuth session started.");
        }

        const hydraChallenge = req.session.hydraConsentChallenge;

        // reject consent
        if ( req.body.consent !== true ) {
            const rejectConsentRequest = {
                error: 'access_denied',
                error_description: 'The resource owner denied the request'
            }

            const {data: result} = await hydraClient.rejectConsentRequest(hydraChallenge, rejectConsentRequest);
            res.json({
                redirect_to: result.redirect_to
            });
            return;
        }

        // make sure the scopes are in array format
        let grant_scope = req.body.grant_scope;
        if ( !Array.isArray(grant_scope) ) {
            grant_scope = [grant_scope];
        }

        // get consent request info & build accept object
        const {data: body} = await hydraClient.getConsentRequest(hydraChallenge);
        const acceptConsentRequest = {
            grant_scope: grant_scope,
            grant_access_token_audience: body.requested_access_token_audience,
            remember: body.remember,
            remember_for: 3600,
            session: createHydraSession(body.requested_scope, body.context)
        }

        // accept consent
        const {data: result} = await hydraClient.acceptConsentRequest(hydraChallenge, acceptConsentRequest);
        res.json({
            redirect_to: result.redirect_to
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    consent,
    consentInfo,
    consentFinish
}