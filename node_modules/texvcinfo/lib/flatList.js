"use strict";
var tokenTypes = require('./tokenTypes');
module.exports = function (e, c) {
    var tokenLister = function (e) {
        if (Array.isArray(e)) {
            return [].concat.apply([], e.map(tokenLister));
        }
        var result = [];
        var name = tokenTypes.format(e.name, c);
        if (typeof e[0] === 'string' || e[0] instanceof String) {
            result.push([name, e[0]]);
        } else {
            result.push([name, ""]);
        }
        for (var i = 0; i < e.length; i++) {
            if (!(typeof e[i] === 'string' || e[i] instanceof String)) {
                result = result.concat(tokenLister(e[i]));
            }
        }
        return result;
    };
    return tokenLister(e);
};