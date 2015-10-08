"use strict";

var tokenLister = module.exports = function (e) {
    if (Array.isArray(e)) {
        return [].concat.apply([], e.map(tokenLister));
    }
    var result = [];
    if (typeof e[0] === 'string' || e[0] instanceof String) {
        result.push([e.name, e[0]]);
    } else {
        result.push([e.name, ""]);
    }
    for (var i = 0; i < e.length; i++) {
        if (!(typeof e[i] === 'string' || e[i] instanceof String)) {
            result = result.concat(tokenLister(e[i]));
        }
    }
    return result;
};