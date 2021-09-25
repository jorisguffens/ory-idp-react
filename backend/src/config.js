const crypto = require('crypto');

const {
    PublicApi: KratosPublicApi,
    Configuration: KratosConfiguration,
} = require('@oryd/kratos-client');

const {
    AdminApi: HydraAdminApi,
    Configuration: HydraConfiguration,
} = require('@ory/hydra-client');
const Url = require("url");

// Client for interacting with Hydra's Admin API
const hydraClient = new HydraAdminApi(
    new HydraConfiguration({ basePath: process.env.HYDRA_ADMIN_URI })
)

// Client for interacting with Kratos' Public and Admin API
const kratosClient = new KratosPublicApi(
    new KratosConfiguration({ basePath: process.env.KRATOS_PUBLIC_URI })
)

module.exports = {
    hydraClient,
    kratosClient
}