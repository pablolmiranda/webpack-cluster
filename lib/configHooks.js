'use strict';

var path = require('path'),
    glob = require('glob'),
    glob2base = require('glob2base'),
    _ = require('lodash');

/**
 * @private
 * @alias HOOKS
 * @constant
 * @type {Object<String,Function>}
 */
var HOOKS = {
    /**
     * @private
     * @param {String} key
     * @param {Config} currConfig
     * @param {Config} prevConfig
     * @returns {String}
     */
    'output.path': function(key, currConfig, prevConfig) {
        var prevOutputPath = _.get(prevConfig, key),
            currOutputPath = _.get(currConfig, key),
            resolveRoot = _.get(prevConfig, 'resolve.root', []),
            resolveGlob = _.get(currConfig, 'resolve.glob'),
            isGlob = _.includes(resolveGlob, '*'),
            resolveBase,
            outputPath;

        if (currOutputPath) {
            currOutputPath = path.resolve(currOutputPath);
        }

        if (prevOutputPath) {
            prevOutputPath = path.resolve(prevOutputPath);
        }

        if (resolveGlob) {
            resolveGlob = path.resolve(glob2base(new glob.Glob(resolveGlob)));
        }

        if (_.has(prevConfig, 'resolve.base')) {
            resolveBase = _.get(prevConfig, 'resolve.base');
        } else if (_.has(currConfig, 'resolve.base')) {
            resolveBase = _.get(currConfig, 'resolve.base');
        } else if (isGlob) {
            resolveBase = resolveGlob;
        } else if (!isGlob) {
            resolveBase = _.find(resolveRoot.reverse(), function(root) {
                return resolveGlob.replace(root, '') !== '';
            });
        }

        if (resolveBase) {
            resolveBase = path.resolve(resolveBase);
        }

        outputPath = path.join(currOutputPath, prevOutputPath.replace(resolveBase, ''));

        return outputPath;
    }
};

/**
 * @private
 * @module webpack-glob/lib/configHooks
 * @returns {HOOKS}
 */
module.exports = HOOKS;