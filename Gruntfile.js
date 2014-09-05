/* jshint node:true */
'use strict';
var glob = require('glob');

function loadConfig (path) {
    var object = {};
    var key;

    glob.sync('*', { cwd: path }).forEach(function (option) {
        key = option.replace(/\.js$/,'');
        object[key] = require(path + option);
    });

    return object;
}

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.loadTasks('grunt-tasks');

    var localConfig;
    try {
        localConfig = require('./localConfig.js');
    } catch (e) {
        localConfig = {};
    }

    var config = {
        pkg: grunt.file.readJSON('package.json'),
        env: process.env,
        config: require('./grunt-tasks/util/config.js'),
        localConfig: localConfig
    };

    grunt.util._.extend(config, loadConfig('./grunt-tasks/options/'));
    grunt.initConfig(config);
};
