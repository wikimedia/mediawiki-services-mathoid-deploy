"use strict";

var tokenTree = module.exports = function (e) {
    if (Array.isArray(e)) {
        return  e.map(tokenTree);
    }
    if (typeof e === 'string' || e instanceof String) {
        return [e];
    }
    var result = [e.name];
    for (var i = 0; i < e.length; i++) {
        result.push(tokenTree(e[i]));
    }
    return result;
};