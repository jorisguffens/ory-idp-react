const cssModules = require('./css-modules/css-modules.js');

module.exports = {
    webpack: (config, env) => {

        config = cssModules(config, env);

        return config;
    }
};