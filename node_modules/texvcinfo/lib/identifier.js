// Render an AST.
"use strict";

var ast = require('./extractors/mods').ast;
var letterMods = require('./letterMods.json');
var literals = require('./literals.json');

var render = module.exports = function render(e) {
    if (Array.isArray(e)) {
        var out = [].concat.apply([], e.map(render));
        // Workaround to associate '-suffix to the previous variable
        var outpos, offset = 0;
        var int = 0;
        for (var inpos = 0; inpos < out.length; inpos++) {
            outpos = inpos - offset;
            switch (out[inpos]) {
                case "'":
                    out[outpos - 1] = out[outpos - 1] + "'";
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
                    out[outpos] = out[inpos];
            }
        }
        out = out.slice(0, out.length - offset);
        return out;
    }
    if (typeof e === 'string' || e instanceof String) {
        return e;
    }
    if (e.name === "TEX_ONLY") {
        return e.id_part();
    }
    return e.extractIdentifiers();
};

var renderArgs = function () {
    var args = Array.prototype.slice.call(arguments);
    return [].concat.apply([], args.map(render));
};

var fun1 = function (f, a) {
    if (letterMods.indexOf(f) >= 0) {
        var ident=  a.getModIdent();
        if(ident.length===0){
            return renderArgs(a);
        }
        return [f + "{" +ident+ "}"];
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
    LITERAL: function (r) {
        var s = r.id_part().trim();
        if (/^([a-zA-Z']|\\int)$/.test(s)) {
            return [s];
        } else if (literals.indexOf(s) >= 0) {
            return [s];
        } else {
            return [];
        }
    },
    FUN1: fun1,
    FUN1nb: fun1,
    DECLh: function (f, _, a) {
        return renderArgs(a).join('');
    },
    FUN2: function (f, a, b) {
        return renderArgs(a, b);
    },
    FUN2nb: function (f, a, b) {
        return renderArgs(f, a, b);
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
