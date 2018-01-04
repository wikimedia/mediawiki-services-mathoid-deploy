"use strict";
var texvcjs = require("mathoid-texvcjs");
var indentifierExtractor = module.exports.treeFromAst = require('./identifier').render;
var packageList = ['ams', 'cancel', 'color', 'euro', 'teubner', 'mhchem'];
var tokList = require('./flatList.js');
module.exports = function (input, options) {
    var out = {
        success: true
    };
    options = options || {};
    var texvcres = texvcjs.check(input, Object.assign(options, {usemathrm:true}));
    //TODO: Backwards compatibility consider to remove in the next update
    if (texvcres.status === 'C') {
      out.success = false;
      out.error = {
        status: texvcres.status,
        message: "Attempting to use the $\\ce$ command outside of a chemistry environment.",
        detail: texvcres.details,
        found: "\\ce", // ce is the only command that can trigger this problem
        name: "SyntaxError"
      };
      return out;
    }
    if (texvcres.status !== '+') {
        return texvcres;
    }
    input = texvcres.input;
    out.checked = texvcres.output;
    out.requiredPackages = [];
    packageList.forEach(function (pkg) {
        if (texvcres[pkg + '_required']) {
            out.requiredPackages.push(pkg);
        }
    });
    out.identifiers = indentifierExtractor(input);
    out.endsWithDot = false;
    var tokens = tokList(input, true);
    if (tokens.length && tokens[tokens.length - 1][0] === 0 && tokens[tokens.length - 1][1] === '.') {
        out.endsWithDot = true;
    }
    return out;
};