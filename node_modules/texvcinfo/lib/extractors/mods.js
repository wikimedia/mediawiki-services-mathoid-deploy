"use strict";

var ast = module.exports.ast = require('./subscripts').ast;
var applyOnArray = require('./subscripts').applyOnArray;
var fun1Arr = require('./subscripts').fun1Arr;
var letterMods = require('../letterMods.json');
var literals = require('../literals.json');

var getMod = function (x) {
    if (x instanceof Array) {
        return applyOnArray(x, 'getModIdent');
    }
    return x.getModIdent();
};

var fun1Mod = function (f, a) {
    return fun1Arr(f, getMod(a));
};

ast.Tex.defineVisitor("getModIdent", {
    LITERAL: function (r) {
        var s = r.id_part().trim();
        if (/^([0-9a-zA-Z'])$/.test(s) ||
            literals.indexOf(s) >= 0
        ) {
            return [s];
        } else if (r.id_part() === "\\ ") {
            return [r.id_part()];
        }
        return [];
    },
    BIG: function () {
        return [];
    },
    BOX: function () {
        return [];
    },
    CURLY: getMod,
    DECLh: function () {
        return [];
    },
    DQ: function (base, down) {
        var d = down.extractSubscipts(),
            b = base.getModIdent();
        if (b.length && b[0] === "'") {
            return [];
        }
        if (d.length && b.length) {
            return [b + "_{" + d + "}"];
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
    FUN1: fun1Mod,
    FUN1nb: fun1Mod,
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