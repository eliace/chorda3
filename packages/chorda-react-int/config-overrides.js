const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const path = require('path')
const {alias, configPaths} = require('react-app-rewire-alias')

module.exports = function override(config, env) {
    config.resolve.plugins = config.resolve.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
    config.module.rules[1].oneOf[2].include = undefined
    config.module.rules[1].oneOf[2].exclude = /(node_modules)/
    console.log(config.resolve.alias)
    Object.assign(config.resolve.alias, {
        '@chorda/react': path.resolve('../chorda-react/src'),
        '@chorda/engine': path.resolve('../chorda-engine/src'),
        '@chorda/core': path.resolve('../chorda-core/src'),
    })
    
    return config// alias(configPaths('./tsconfig.paths.json'))(config);
  }