"use strict";

var log4js = require("log4js"),
    log4js_extend = require("log4js-extend");
var path = require("path");

log4js_extend(log4js, {
  path: path.dirname(require.main.filename),
  format: "- @name (@file:@line:@column)"
});

// var logger = log4js.getLogger("category");

module.exports = log4js;