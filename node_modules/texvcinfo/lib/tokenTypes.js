"use strict";
var tokenTypeArrays = module.exports.typeArray = ["TEX_ONLY", "LITERAL", "FQ", "DQ", "FQN", "DQN",
    "FUN1", "FUN1hf", "DECLh", "FUN2", "FUN2h", "FUN2nb", "FUN2sq",
    "CURLY", "INFIX", "INFIXh", "BOX", "BIG", "MATRIX", "LR"];

var toNumber = module.exports.toNumber = function (n) {
    return tokenTypeArrays.indexOf(n);
};

module.exports.format = function (n, c) {
    if (c) {
        return toNumber(n);
    }
    return n;
};