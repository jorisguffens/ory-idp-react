const ruleChildren = (loader) => loader.use || loader.oneOf || Array.isArray(loader.loader) && loader.loader || [];

const findIndexAndRules = (rulesSource, ruleMatcher) => {
    let result = undefined;
    const rules = Array.isArray(rulesSource) ? rulesSource : ruleChildren(rulesSource);
    rules.some((rule, index) => result = ruleMatcher(rule) ? {
        index,
        rules
    } : findIndexAndRules(ruleChildren(rule), ruleMatcher));
    return result;
};

const findRule = (rulesSource, ruleMatcher) => {
    const {index, rules} = findIndexAndRules(rulesSource, ruleMatcher);
    return rules[index];
};

const cssRuleMatcher = (rule) => rule.test && String(rule.test) === String(/\.css$/);
const cssModulesRuleMatcher = (rule) => rule.test && String(rule.test) === String(/\.module\.css$/);
const sassRuleMatcher = (rule) => rule.test && String(rule.test) === String(/\.(scss|sass)$/);
const sassModulesRuleMatcher = (rule) => rule.test && String(rule.test) === String(/\.module\.(scss|sass)$/);

module.exports = function (config, env) {
    const cssRule = findRule(config.module.rules, cssRuleMatcher);
    const cssModulesRule = findRule(config.module.rules, cssModulesRuleMatcher);
    const sassRule = findRule(config.module.rules, sassRuleMatcher);
    const sassModulesRule = findRule(config.module.rules, sassModulesRuleMatcher);

    cssRule.test = /\.normal\.css$/;
    sassRule.test = /\.normal\.(scss|sass)$/;

    cssModulesRule.test = /\.css$/;
    sassModulesRule.test = /\.(scss|sass)$/;

    return config
};

