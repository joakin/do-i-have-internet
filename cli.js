#! /usr/bin/env node

const dateStr = require("./lib/date-str");

const url = "http://captive.apple.com/";

require("./index.js")(url, (err, res, data) => {
  const up = res && res.statusCode >= 200 && res && res.statusCode < 300;
  console.log(up ? "UP" : "DOWN", dateStr(new Date()));
});
