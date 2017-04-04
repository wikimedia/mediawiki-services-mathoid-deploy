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
            "success": false,
            "error": {
                "message": "Expected \"-\", \"[\", \"\\\\\", \"\\\\begin\", \"\\\\begin{\", \"]\", \"^\", \"_\", \"{\", [ \\t\\n\\r], [%$], [().], [,:;?!'], [/|], [0-9], [><~], [\\-+*=], or [a-zA-Z] but end of input found.",
                "expected": [
                    {
                        "type": "class",
                        "parts": [
                            " ",
                            "\t",
                            "\n",
                            "\r"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "_",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "^",
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            [
                                "a",
                                "z"
                            ],
                            [
                                "A",
                                "Z"
                            ]
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            [
                                "0",
                                "9"
                            ]
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            ",",
                            ":",
                            ";",
                            "?",
                            "!",
                            "'"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "-",
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            "-",
                            "+",
                            "*",
                            "="
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\",
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            ">",
                            "<",
                            "~"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            "%",
                            "$"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            "(",
                            ")",
                            "."
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "class",
                        "parts": [
                            "/",
                            "|"
                        ],
                        "inverted": false,
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "[",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "{",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\begin",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "\\begin{",
                        "ignoreCase": false
                    },
                    {
                        "type": "literal",
                        "text": "]",
                        "ignoreCase": false
                    }
                ],
                "found": null,
                "location": {
                    "start": {
                        "offset": 12,
                        "line": 1,
                        "column": 13
                    },
                    "end": {
                        "offset": 12,
                        "line": 1,
                        "column": 13
                    }
                },
                "name": "SyntaxError"
            }
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