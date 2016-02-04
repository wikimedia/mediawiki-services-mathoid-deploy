"use strict";
var texvcjs = require("texvcjs");
var indentifierExtractor = module.exports.treeFromAst = require('./identifier');
var packageList = ['ams', 'cancel', 'color', 'euro', 'teubner', 'mhchem'];
var tokList = require('./flatList.js');
module.exports = function (input,options) {
    var out = {
        success: true
    };
    try {
        // allow user to pass a parsed AST as input, as well as a string
        if (typeof(input) === 'string') {
            input = texvcjs.parse(input, {usemathrm:true});
        }
    } catch (e) {
        out.success = false;
        out.error = e;
        return out;
    }
    options = options || {};
    var texvcres = texvcjs.check(input,options);
    if (texvcres.status !== '+') {
        out.success = false;
        out.status = texvcres.status;
        out.detail = texvcres.details;
        return out;
    }
    out.checked = texvcres.output;
    out.requiredPackages = [];
    packageList.forEach(function(pkg) {
        if ( texvcres[pkg+'_required'] ) {
            out.requiredPackages.push(pkg);
        }
    });
    out.identifiers = indentifierExtractor(input);
    out.endsWithDot = false;
    var tokens = tokList(input,true);
    if (tokens.length && tokens[tokens.length - 1][0] === 0 && tokens[tokens.length - 1][1] === '.') {
        out.endsWithDot = true;
    }
    return out;
};