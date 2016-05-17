"use strict";

var ast = require('./extractors/mods').ast;
var getLiteral = require('./extractors/subscripts').getLiteral;
var letterMods = require('./letterMods.json');
var literals = require('./literals.json');

/**
 * This function
 *  - removes the identifier $d$ from integrals. For example
 *    $\int f(x)\, dx$ has only two identifiers $f$ and $x$.
 *  - associates the suffix $'$ with the predeceasing identifier.
 *    For example $x'$ would be recognized as one identifier, rather
 *    than $x$ and $'$
 * @param list
 * @returns {Array.<T>|ArrayBuffer|Array|string|Blob|Buffer|*}
 */
function fixIntegralAndSuffix(list) {
    var outpos, offset = 0;
    var int = 0;
    for (var inpos = 0; inpos < list.length; inpos++) {
        outpos = inpos - offset;
        switch (list[inpos]) {
            case "'":
                list[outpos - 1] = list[outpos - 1] + "'";
                offset++;
                break;
            case "\\int":
                int++;
                offset++;
                break;
            case "\\mathrm{d}":
            case "d":
                if (int) {
                    int--;
                    offset++;
                    break;
                }
            /* falls through */
            default :
                list[outpos] = list[inpos];
        }
    }
    return list.slice(0, list.length - offset);
}

var render = module.exports.render = function render(e) {
    if (Array.isArray(e)) {
        return fixIntegralAndSuffix([].concat.apply([], e.map(render)));
    }
    if (typeof e === 'string' || e instanceof String) {
        return e;
    }
    if (typeof e.extractIdentifiers === 'function') {
        return e.extractIdentifiers();
    } else {
        return [];
    }
};

var renderArgs = function () {
    var args = Array.prototype.slice.call(arguments);
    return [].concat.apply([], args.map(render));
};

var fun1 = function (f, a) {
    if (letterMods.indexOf(f) >= 0) {
        var ident = a.getModIdent();
        if (ident.length === 0) {
            return renderArgs(a);
        }
        return [f + "{" + ident + "}"];
    }
    return renderArgs(a);
};

ast.Tex.defineVisitor("extractIdentifiers", {
    FQ: function (base, down, up) {
        return renderArgs(base, down, up);
    },
    DQ: function (base, down) {
        var d = down.extractSubscipts(),
            b = render(base);
        if (b instanceof Array && b.length > 1) {
            return renderArgs(base, down);
        }
        if (b.length && b[0] === "'") {
            return b.concat(d);
        }
        if (d.length && b.length) {
            if (b[0] === "\\int") {
                return b.concat(d);
            }
            return [b + "_{" + d + "}"];
        }
        return renderArgs(base, down);
    },
    UQ: function (base, up) {
        return renderArgs(base, up);
    },
    FQN: function (down, up) {
        return renderArgs(down, up);
    },
    DQN: function (down) {
        return renderArgs(down);
    },
    UQN: function (up) {
        return renderArgs(up);
    },
    LITERAL: getLiteral(literals, /^([a-zA-Z']|\\int)$/),
    FUN1: fun1,
    FUN1nb: fun1,
    DECLh: function (f, _, a) {
        var ars = renderArgs(a);
        if (ars.length) {
            return renderArgs(a).join('');
        } else {
            return [];
        }
    },
    FUN2: function (f, a, b) {
        return renderArgs(a, b);
    },
    FUN2nb: function (f, a, b) {
        return renderArgs(a, b);
    },
    FUN2sq: function (f, a, b) {
        return renderArgs(a, b);
    },
    CURLY: function (tl) {
        return render(tl);
    },
    INFIX: function (s, ll, rl) {
        return renderArgs(ll, rl);
    },
    BOX: function () {
        return [];
    },
    BIG: function () {
        return [];
    },
    MATRIX: function (t, m) {
        var render_line = function (l) {
            return l.map(render);
        };
        var render_matrix = function (m) {
            return m.map(render_line);
        };
        return render(render_matrix(m));
    },
    LR: function (l, r, tl) {
        return render(tl);
    }
});