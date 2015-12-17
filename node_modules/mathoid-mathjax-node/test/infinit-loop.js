var tape = require('tape');
var mjAPI = require("..//lib/mj-single.js");

tape('basic test: check MathJax core', function(t) {
    t.plan(1);

    var tex = "\\underbrace {a \\choose b}";
    mjAPI.start();

    mjAPI.typeset({
        math: tex,
        format: "inline-TeX",
        mml: true
    }, function(data) {
        t.ok(data.mml.indexOf("mfrac")>0, 'MathJax does not crash on underbrace');
    });
});