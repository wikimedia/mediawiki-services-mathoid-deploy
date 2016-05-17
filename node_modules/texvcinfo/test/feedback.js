"use strict";
var assert = require('assert');
var texvcinfo = require('../');
var testcases = [
    {
        input: '',
        out: {
            "checked": "",
            "identifiers": [],
            requiredPackages: [],
            "success": true,
            endsWithDot: false
        }
    },
    {
        input: '{\\cos(x).}',
        out: {
            "checked": "{\\cos(x).}",
            "identifiers": ['x'],
            requiredPackages: [],
            endsWithDot: true,
            "success": true
        }
    },
    {
        input: '{\\cos\\left(x.\\right)}',
        out: {
            "checked": "{\\cos \\left(x.\\right)}",
            "identifiers": ['x'],
            requiredPackages: [],
            endsWithDot: false,
            "success": true
        }
    },
    {
        input: '\\mathbb{x}',
        out: {
            "checked": "\\mathbb {x} ",
            "identifiers": [
                "\\mathbb{x}"
            ],
            requiredPackages: ['ams'],
            "success": true,
            endsWithDot: false
        }
    },
    {
        input: 'a+\\badfunc-b',
        out: {
            "error": {
                "expected": [],
                "found": "\\badfunc",
                "location": {
                    "end": {
                        "column": 11,
                        "line": 1,
                        "offset": 10
                    },
                    "start": {
                        "column": 3,
                        "line": 1,
                        "offset": 2
                    }
                },
                "message": "Illegal TeX function",
                "name": "SyntaxError"
            },
            "success": false
        }
    },
    {
        input: '\\sin\\left(x)',
        out: {
            "error": {
                "expected": [
                    {
                        "description": "\"-\"",
                        "type": "literal",
                        "value": "-"
                    },
                    {
                        "description": "\"[\"",
                        "type": "literal",
                        "value": "["
                    },
                    {
                        "description": "\"\\\\\"",
                        "type": "literal",
                        "value": "\\"
                    },
                    {
                        "description": "\"\\\\begin\"",
                        "type": "literal",
                        "value": "\\begin"
                    },
                    {
                        "description": "\"\\\\begin{\"",
                        "type": "literal",
                        "value": "\\begin{"
                    },
                    {
                        "description": "\"]\"",
                        "type": "literal",
                        "value": "]"
                    },
                    {
                        "description": "\"^\"",
                        "type": "literal",
                        "value": "^"
                    },
                    {
                        "description": "\"_\"",
                        "type": "literal",
                        "value": "_"
                    },
                    {
                        "description": "\"{\"",
                        "type": "literal",
                        "value": "{"
                    },
                    {
                        "description": "[ \\t\\n\\r]",
                        "type": "class",
                        "value": "[ \\t\\n\\r]"
                    },
                    {
                        "description": "[%$]",
                        "type": "class",
                        "value": "[%$]"
                    },
                    {
                        "description": "[().]",
                        "type": "class",
                        "value": "[().]"
                    },
                    {
                        "description": "[,:;?!\\']",
                        "type": "class",
                        "value": "[,:;?!\\']"
                    },
                    {
                        "description": "[-+*=]",
                        "type": "class",
                        "value": "[-+*=]"
                    },
                    {
                        "description": "[0-9]",
                        "type": "class",
                        "value": "[0-9]"
                    },
                    {
                        "description": "[><~]",
                        "type": "class",
                        "value": "[><~]"
                    },
                    {
                        "description": "[\\/|]",
                        "type": "class",
                        "value": "[\\/|]"
                    },
                    {
                        "description": "[a-zA-Z]",
                        "type": "class",
                        "value": "[a-zA-Z]"
                    }
                ],
                "found": null,
                "location": {
                    "end": {
                        "column": 13,
                        "line": 1,
                        "offset": 12
                    },
                    "start": {
                        "column": 13,
                        "line": 1,
                        "offset": 12
                    }
                },
                "message": "Expected \"-\", \"[\", \"\\\\\", \"\\\\begin\", \"\\\\begin{\", \"]\", \"^\", \"_\", \"{\", [ \\t\\n\\r], [%$], [().], [,:;?!\\'], [-+*=], [0-9], [><~], [\\/|] or [a-zA-Z] but end of input found.",
                "name": "SyntaxError"
            },
            "success": false
        }
    },
    {
        input: '\\ce{H2O}',
        options: {usemhchem: true},
        out: {
            "checked": "{\\ce {H2O}}",
            "endsWithDot": false,
            "identifiers": [
                "H",
                "O"
            ],
            "requiredPackages": [
                "mhchem"
            ],
            "success": true
        }
    }, {
        input: '\\ce{H2O}',
        out: {
            "error": {
                "detail": "mhchem package required.",
                "found": "\\ce",
                "message": "Attempting to use the $\\ce$ command outside of a chemistry environment.",
                "name": "SyntaxError",
                "status": "C"
            },
            "success": false
        }
    }
];

describe('Feedback', function () {
    testcases.forEach(function (tc) {
        var input = tc.input;
        var output = tc.out;
        var options = tc.options;
        it('should give adequate feedback ' + JSON.stringify(input), function () {
            assert.deepEqual(texvcinfo.feedback(input, options), output);
        });
    });
});