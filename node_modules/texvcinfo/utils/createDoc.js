#!/usr/bin/env node
"use strict";
var fs = require('fs'),
    letterMods = require('../lib/letterMods.json'),
    literals = require('../lib/literals.json');

var printMod = function (x) {
    var textString = x.replace("\\", "\\textbackslash ");
    return "\\texttt{" + textString + "} applied on $x,X$ is rendered as $" + x + "{x}," + x + "{X}$\n\n";
};

var printLiteral = function (x) {
    var textString = x.replace("\\", "\\textbackslash ");
    return "\\texttt{" + textString + "} is rendered as $" + x + "$\n\n";
};
var write = function (fn, content) {
    fs.writeFile("./../doc/" + fn + ".tex", content, function (err) {
        if (err) {
            console.log('error saving document', err);
        } else {
            console.log('The file "' + fn + '" was saved!');
        }
    });
};
write("commands", letterMods.map(printMod).join('\n'));
write("literals", literals.map(printLiteral).join('\n'));

