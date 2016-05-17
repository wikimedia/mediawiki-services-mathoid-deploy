"use strict";

var ast = module.exports.ast = require('texvcjs').ast;
var letterMods = require('../letterMods.json');
var extendedLiterals = require('../literals.json');
extendedLiterals.push('\\infty', '\\emptyset');

ast.RenderT.defineVisitor("id_part", {
    HTMLABLE: function (_, t, _2) {
        return t;
    },
    HTMLABLEM: function (_, t, _2) {
        return t;
    },
    HTMLABLEC: function (_, t, _2) {
        return t;
    },
    MHTMLABLEC: function (_, t, _2, _3, _4) {
        return t;
    },
    HTMLABLE_BIG: function (t, _) {
        return t;
    },
    TEX_ONLY: function (t) {
        return t;
    }
});

var getLiteral = module.exports.getLiteral = function (lit, regexp) {
    return function (r) {
        var s = r.id_part().trim();
        if (regexp.test(s)) {
            return [s];
        } else if (lit.indexOf(s) >= 0) {
            return [s];
        } else {
            return [];
        }
    };
};

var applyOnArray = module.exports.applyOnArray = function (arr, fName) {
    var y = [];
    arr.forEach(function (e) {
        var fun = Object.getPrototypeOf(e)[fName];
        y = y.concat(fun.call(e));
    });
    if (arr.length>0 && arr.length === y.length) {
        return y.join('');
    } else {
        return [];
    }
};

var getSub = function (x) {
    if (x instanceof Array) {
        return applyOnArray(x, 'extractSubscipts');
    }
    if (typeof x === "string" || x instanceof String) {
        return x;
    }
    return x.extractSubscipts();
};


var fun1Arr = module.exports.fun1Arr = function (f, s) {
    if (s.length && letterMods.indexOf(f) >= 0) {
        return [f + "{" + s + "}"];
    }
    return [];
};

var fun1Sub = function (f, a) {
    return fun1Arr(f, getSub(a));
};

ast.Tex.defineVisitor("extractSubscipts", {
    LITERAL: getLiteral(extendedLiterals, /^([0-9a-zA-Z\+',\-])$/),
    BIG: function () {
        return [];
    },
    BOX: function () {
        return [];
    },
    CURLY: getSub,
    DECLh: function (f, a, x) {
        //@see http://tex.stackexchange.com/questions/98406/which-command-should-i-use-for-textual-subscripts-in-math-mode
        // cf https://phabricator.wikimedia.org/T56818 a is always RM
        // for f there are only four cases
        switch (f) {
            case "\\rm":
                f = "\\mathrm";
                break;
            case "\\it":
                f = "\\mathit";
                break;
            case "\\cal":
                f = "\\mathcal";
                break;
            case "\\bf":
                f = "\\mathbf";
        }
        x = getSub(x);
         if (x.length>0) {
            return [f + "{" + x + "}"];
        } else {
            return [];
        }
    },
    DQ: function (base, down) {
        var d = [].concat(down.extractSubscipts()),
            b = base.extractSubscipts();
        if (b.length === 1 && d.length > 0) {
            return [b + "_{" + d.join('') + "}"];
        }
        return [];
    },
    DQN: function () {
        return [];
    },
    FQ: function () {
        return [];
    },
    FQN: function () {
        return [];
    },
    FUN1: fun1Sub,
    FUN1nb: fun1Sub,
    FUN2: function () {
        return [];
    },
    FUN2nb: function () {
        return [];
    },
    FUN2sq: function () {
        return [];
    },
    INFIX: function () {
        return [];
    },
    LR: function () {
        return [];
    },
    MATRIX: function () {
        return [];
    },
    UQ: function () {
        return [];
    },
    UQN: function () {
        return [];
    }
});