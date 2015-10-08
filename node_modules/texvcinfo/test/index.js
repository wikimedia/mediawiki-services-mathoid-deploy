"use strict";
var assert = require('assert');
var texvcinfo = require('../');
var testcases = [
    {input: '', options: '', out: []},
    {
        input: '\\mathbb{x}',
        options: {format: "tree"},
        out: [["FUN1nb", ["\\mathbb"], ["CURLY", [["LITERAL", ["TEX_ONLY", ["x"]]]]]]]
    },
];

describe('Index', function () {
    testcases.forEach(function (tc) {
        var input = tc.input;
        var options = tc.options;
        var output = tc.out;
        it('should correctly render ' + JSON.stringify(input), function () {
            assert.deepEqual(texvcinfo.texvcinfo(input, options), output);
        });
    });
});