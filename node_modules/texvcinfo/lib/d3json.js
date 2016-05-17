"use strict";
module.exports = function (e, flat) {
    var tokenTree = function (e) {
        if (Array.isArray(e)) {
            return {name: 'root', children: e.map(tokenTree)};
        }
        if (typeof e === 'string' || e instanceof String) {
            return {name: e};
        }
        var result = [];
        if (flat && e.length === 1) {
            result = tokenTree(e[0]);
            if (!result.children) {
                result.name = e.name + "->" + result.name;
                return result;
            }
        } else {
            for (var i = 0; i < e.length; i++) {
                result.push(tokenTree(e[i]));
            }
        }
        return {name: e.name, children: result};
    };
    return tokenTree(e);
};
