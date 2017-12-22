"use strict";

var json = require('../package.json');
var feedback = require('./feedback');

module.exports = {
    name: json.name, // package name
    version: json.version, // version # for this package
    feedback: feedback
};

var texvcjs = require('mathoid-texvcjs');
var lister = module.exports.tokensFromAst = require('./flatList');
var treeWriter = module.exports.treeFromAst = require('./arrayTree');
var jsonWriter = module.exports.treeFromAst = require('./d3json');
var indentifierExtractor = module.exports.treeFromAst = require('./identifier').render;

module.exports.texvcinfo = function (input, options) {
    try {
        // allow user to pass a parsed AST as input, as well as a string
        if (typeof(input) === 'string') {
            input = texvcjs.parse(input);
        }
        var output;
        if (!options) {
            options = {format: "list"};
        }
        switch (options.format) {
            case "tree":
                output = treeWriter(input, options.compact);
                break;
            case "json":
                output = jsonWriter(input, options.flatTree);
                break;
            case "identifier":
                output = indentifierExtractor(input);
                break;
            case "all":
                output = {
                    tree: treeWriter(input, options.compact),
                    identifier: indentifierExtractor(input),
                    list: lister(input, options.compact)
                };
                break;
            default:
                output = lister(input, options.compact);
        }
        return output;
    } catch (e) {
        if (options && options.debug) {
            throw e;
        }
        if (e instanceof texvcjs.SyntaxError) {
            if (e.message === 'Illegal TeX function') {
                return {
                    status: 'F', details: e.found,
                    offset: e.offset, line: e.line, column: e.column
                };
            }
            return {
                status: 'S', details: e.toString(),
                offset: e.offset, line: e.line, column: e.column
            };
        }
        return {status: '-', details: e.toString()};
    }
};
