"use strict";
var texvcjs = require("texvcjs");
var indentifierExtractor = module.exports.treeFromAst = require('./identifier');
var packageList = ['ams', 'cancel', 'color', 'euro', 'teubner'];

module.exports = function (input) {
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
    var texvcres = texvcjs.check(input);
    out.checked = texvcres.output;
    out.requiredPackages = [];
    packageList.forEach(function(pkg) {
        if ( texvcres[pkg+'_required'] ) {
            out.requiredPackages.push(pkg);
        }
    });
    out.identifiers = indentifierExtractor(input);
    return out;
};