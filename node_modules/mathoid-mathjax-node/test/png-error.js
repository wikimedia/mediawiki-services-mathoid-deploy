var tape = require('tape');
var mjAPI = require("..//lib/mj-single.js");

tape('PNG rendering: input with invalid render dimensions', function(t) {
    t.plan(1);

    var tex = '\\textstyle{}';  // from https://phabricator.wikimedia.org/T134652
    mjAPI.start();

    mjAPI.typeset({
        math: tex,
        format: "inline-TeX",
        png: true,
        mathoidStyle: true
    }, function (data) {
        t.ok(/Expected width > 0/.test(data.errors), 'Dimensions are invalid');
    });
});
