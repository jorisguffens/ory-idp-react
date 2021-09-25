const {hydraClient, kratosClient} = require('../config');
const crypto = require("crypto");

async function redirectToLogin(req, res, next) {
    try {
        if (!req.session) {
            throw new Error("Unable to use sessions.");
        }

        const state = crypto.randomBytes(48).toString('hex')
        req.session.hydraLoginState = state;

        const error = await req.session.save();
        if (error) {
            throw error;
        }

        // return back to this server to finish hydra login
        const returnTo = new URL(process.env.APP_URI + "/oauth/login");
        returnTo.searchParams.set('hydra_login_state', state);
        returnTo.searchParams.set('login_challenge', req.query.login_challenge);

        // init kratos login flow
        const result = await kratosClient.initializeSelfServiceLoginViaBrowserFlow({
            query: {
                refresh: true,
                return_to: returnTo.toString()
            }
        });

        // redirect to ui with given flow id
        const redirectTo = new URL(process.env.APP_URI + "/auth/login");
        redirectTo.searchParams.set("flow", result.data.id);

        // THIS IS VERY IMPORTANT: SEND THE COOKIES TO THE BROWSER
        res.header('set-cookie', result.headers["set-cookie"]);
        res.redirect(redirectTo.toString());
    } catch (err) {
        next(err);
    }
}

module.exports = async function login(req, res, next) {
    try {
        const hydraChallenge = req.query.login_challenge;

        if (!hydraChallenge) {
            throw new Error("No valid OAuth session started.");
        }

        const {data: body} = await hydraClient.getLoginRequest(hydraChallenge);

        // skip login & accept login request
        if (body.skip) {
            const acceptLoginRequest = {
                subject: body.subject
            };

            const result = await hydraClient.acceptLoginRequest(hydraChallenge, acceptLoginRequest);
            res.redirect(result.data.redirect_to);
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
        const {data: user} = await kratosClient.whoami(req.headers.cookie, null);

        const acceptLoginRequest = {
            subject: user.identity.id,
            context: user
        };

        const result = await hydraClient.acceptLoginRequest(hydraChallenge, acceptLoginRequest);
        res.redirect(result.data.redirect_to);
    } catch (err) {
        next(err);
    }
}
