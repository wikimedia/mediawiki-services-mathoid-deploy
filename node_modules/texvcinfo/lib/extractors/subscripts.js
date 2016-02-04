// Render an AST.
"use strict";

var ast = module.exports.ast =  require('texvcjs').ast;
var letterMods = require('../letterMods.json');
var extendedLiterals = require('../literals.json');
extendedLiterals.push('\\infty','\\emptyset');

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

var getSub = function (x) {
    var y = [];
    if (x instanceof Array) {
        x.forEach(function (e) {
            y = y.concat(e.extractSubscipts());
        });
        if (x.length === y.length) {
            return y.join('');
        } else {
            return [];
        }
    }
    if (typeof x === "string" || x instanceof String){
        return x;
    }
    return x.extractSubscipts();
};
var fun1Sub = function (f, a) {
    var s = getSub(a);
    if (s.length && letterMods.indexOf(f) >= 0) {
        return [f + "{" + s + "}"];
    }
    return [];
};
ast.Tex.defineVisitor("extractSubscipts", {
    LITERAL: function (r) {
        var s = r.id_part().trim();
        if (/^([0-9a-zA-Z\+',\-])$/.test(s)) {
            return [s];
        } else if (extendedLiterals.indexOf(s) >= 0) {
            return [s];
        } else {
            return [];
        }
    },
    BIG: function () {
        return [];
    },
    BOX: function () {
        return [];
    },
    CURLY: getSub,
    DECLh: function (f,a,x) {
        //@TODO: Check http://tex.stackexchange.com/questions/98406/which-command-should-i-use-for-textual-subscripts-in-math-mode
        switch (a.name) {
            case "RM":
                f="\\mathrm";
                break;
            case "IT":
                    f="\\mathit";
                    break;
            case "CAL":
                f= "\\mathcal";
                break;
            case "BF":
                f="\\mathbf";
                break;
            default :
                return [];
        }
        x= getSub(x);
        if(x !== []){
            return [f+"{"+getSub(x)+"}"];
        } else {
            return [];
        }
    },
    DQ: function (base, down) {
        var d = [].concat(down.extractSubscipts()),
            b = base.extractSubscipts();
        if(b.length===1 && d.length >0 ){
            return [b+"_{"+ d.join('')+"}"];
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