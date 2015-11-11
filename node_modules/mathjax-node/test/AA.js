var tape = require('tape');
var mjAPI = require("..//lib/mj-single.js");

tape('basic test: check MathJax core', function(t) {
    t.plan(1);

    var tex = '\\mathrm{\\AA}';
    mjAPI.start();

    mjAPI.typeset({
        math: tex,
        format: "inline-TeX",
        mml: true
    }, function(data) {
        t.ok(data.mml.indexOf("&#xC5;")>0, 'MathJax renders Angström (10^{-10}m) sign.');
    });
});
