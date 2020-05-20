// npm i -D critical@latest

"use strict";

var critical = require('critical');

critical.generate({
    inline: true,
    base: 'build',
    src: './index-raw.html',
    dest: './index.html',
    minify: false,
    width: 1024,
    height: 768
});