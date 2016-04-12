var tape = require('tape');
var mjAPI = require("..//lib/mj-single.js");
tape('basic test: check MathJax core', function(t) {
    t.plan(1);

    var tex = '\\sin(x)';
    mjAPI.start();

    mjAPI.typeset({
        math: tex,
        format: "inline-TeX",
        png: true,
        mathoidStyle: true
    }, function (data) {
        t.ok(data.png.length > 1000, 'PNG has a certain length');
    });
});
