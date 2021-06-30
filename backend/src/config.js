const crypto = require('crypto');

const {
    PublicApi: KratosPublicApi,
    Configuration: KratosConfiguration,
} = require('@oryd/kratos-client');

const {
    AdminApi: HydraAdminApi,
    Configuration: HydraConfiguration,
} = require('@ory/hydra-client');

// Client for interacting with Hydra's Admin API
const hydraClient = new HydraAdminApi(
    new HydraConfiguration({ basePath: process.env.HYDRA_ADMIN_URI })
)

// Client for interacting with Kratos' Public and Admin API
const kratosClient = new KratosPublicApi(
    new KratosConfiguration({ basePath: process.env.KRATOS_PUBLIC_URI })
)

const redirectToLogin = async function(req, res, next) {
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

        const returnTo = new URL(process.env.APP_URI);
        returnTo.searchParams.set('hydra_login_state', state);

        const redirectTo = new URL(process.env.APP_URI + "/login");
        redirectTo.searchParams.set('refresh', 'true');
        redirectTo.searchParams.set('return_to', returnTo.toString());

        res.redirect(redirectTo.toString());
    } catch (err) {
        next(err);
    }
}

module.exports = {
    hydraClient,
    kratosClient,
    redirectToLogin
}