const {redirectToLogin} = require('../config');
const {hydraClient, kratosClient} = require('../config');

module.exports = async function (req, res, next) {
    try {
        const hydraChallenge = req.query.login_challenge;

        if (!hydraChallenge) {
            return redirectToLogin(req, res, next);
        }

        const {data: body} = await hydraClient.getLoginRequest(hydraChallenge);

        // skip login & accept login request
        if (body.skip) {
            const acceptLoginRequest = {
                subject: body.subject
            };

            await hydraClient.acceptLoginRequest(hydraChallenge, acceptLoginRequest);
            res.redirect(body.redirect_to);
            return;
        }

        // no hydra login state
        const hydraLoginState = req.query.hydra_login_state
        if (!hydraLoginState) {
            return redirectToLogin(req, res, next);
        }

        // kratos session cookie
        const kratosSessionCookie = req.cookies.ory_kratos_session
        if (!kratosSessionCookie) {
            return redirectToLogin(req, res, next)
        }

        // session & url state does not match
        if (hydraLoginState !== req.session?.hydraLoginState) {
            return redirectToLogin(req, res, next);
        }

        // accept
        const {data: user} = kratosClient.whoami(null, null, {headers: req.headers});

        const acceptLoginRequest = {
            subject: user.identity.id,
            context: user
        };

        await hydraClient.acceptLoginRequest(hydraChallenge, acceptLoginRequest);
        res.redirect(body.redirect_to);
    } catch (err) {
        next(err);
    }
};
