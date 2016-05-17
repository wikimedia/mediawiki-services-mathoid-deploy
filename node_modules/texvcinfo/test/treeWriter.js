"use strict";
var assert = require('assert');
var texvc = require("texvcjs");
var lister = require('../lib/arrayTree');
var testcases = [
    {in: '', out: []},
    {
        in: '3+\\frac1{7+\\frac1{15+\\dots}}',
        out: [["LITERAL", ["TEX_ONLY", ["3"]]], ["LITERAL", ["TEX_ONLY", ["+"]]], ["FUN2", ["\\frac"], ["LITERAL", ["TEX_ONLY", ["1"]]], ["CURLY", [["LITERAL", ["TEX_ONLY", ["7"]]], ["LITERAL", ["TEX_ONLY", ["+"]]], ["FUN2", ["\\frac"], ["LITERAL", ["TEX_ONLY", ["1"]]], ["CURLY", [["LITERAL", ["TEX_ONLY", ["1"]]], ["LITERAL", ["TEX_ONLY", ["5"]]], ["LITERAL", ["TEX_ONLY", ["+"]]], ["LITERAL", ["TEX_ONLY", ["\\dots "]]]]]]]]]]
    }
];

describe('Render', function () {
    testcases.forEach(function (tc) {
        var input = tc.in;
        var output = tc.out;
        it('should correctly render ' + JSON.stringify(input), function () {
            assert.deepEqual(lister(texvc.parse(input)), output);
        });
    });
});