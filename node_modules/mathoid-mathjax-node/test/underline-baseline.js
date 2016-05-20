var tape = require('tape');
var mjAPI = require("..//lib/mj-single.js");

tape('basic test: check MathJax core', function (t) {
    t.plan(2);

    var tex = '\\underline{\\mathrm{Z}}'; // From https://phabricator.wikimedia.org/T135423
    mjAPI.start();

    mjAPI.typeset({
        math: tex,
        format: "inline-TeX",
        svg: true,
        mathoidStyle: true
    }, function (data) {
        t.ok(data.svg.indexOf('margin-bottom') > 0, 'There should be a margin adjustment');
        t.ok(data.mathoidStyle.indexOf('width') > 0, 'Mathoid style must include width info');
    });
});
