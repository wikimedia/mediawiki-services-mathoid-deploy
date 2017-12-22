var tape = require('tape');
var mjAPI = require("../lib/main.js");

tape('basic test: check MathJax core', function(t) {
    t.plan(1);

    var tex = '\\sdot'; // Other possible test candidates \\bull, \\vline
    mjAPI.start();

    mjAPI.typeset({
        math: tex,
        format: "inline-TeX",
        svg: true,
        mathoidStyle: true
    }, function(data) {
        t.ok(data.svg.indexOf('margin-') > 0, 'There should be margins');
    });
});
