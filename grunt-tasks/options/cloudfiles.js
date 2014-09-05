/* jshint node:true */
var glob = require('glob');
var _ = require('lodash');

var baseConfig = {
    'user': 'encorecloudfiles',
    'key': process.env.cloudFilesApi,
    'region': 'DFW',
    'upload': [{
        'src': 'src/*.json',
        'dest': '',
        'stripcomponents': 1,
        'headers': { 'Access-Control-Allow-Origin': '*'},
        'purge': {
            'emails': ['jay.parlar@rackspace.com'],
            'files': glob.sync('*.json', { cwd: 'src' })
        }
    }]
};

var staging = _.cloneDeep(baseConfig);
staging.upload[0].container = 'encore-ui-nav-staging';

var production = _.cloneDeep(baseConfig);
production.upload[0].container= 'encore-ui-nav';

module.exports = {
    staging: staging,
    production: production
};
