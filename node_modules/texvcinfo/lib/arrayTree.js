"use strict";
var tokenTypes = require('./tokenTypes');
module.exports = function (e, c) {
    var tokenTree = function (e) {
        if (Array.isArray(e)) {
            return e.map(tokenTree);
        }
        if (typeof e === 'string' || e instanceof String) {
            return [e];
        }
        var result = [tokenTypes.format(e.name, c)];
        for (var i = 0; i < e.length; i++) {
            result.push(tokenTree(e[i]));
        }
        return result;
    };
    return tokenTree(e);
};