const http = require("http");

const timeoutIntervals = [1, 1, 2, 3, 5, 8, 13, 21, 34].map(i => i * 1000);
let timeoutIndex = 0;

/**
 * @param {string} url URL to ping periodically to check for internet
 * @param {(Error|null, HTTPResponse, string) : void} cb Function that will be called every time we try
 */
module.exports = function init(url, cb) {
  const respond = (err, res, data) => {
    timeoutIndex = err
      ? 0
      : Math.min(timeoutIndex + 1, timeoutIntervals.length - 1);

    setTimeout(_ => init(url, cb), timeoutIntervals[timeoutIndex]);

    cb(err, res, data);
  };

  let data = "";
  http
    .get(url, res => {
      res.setTimeout(2000);
      res.on("timeout", _ => respond(new Error("Timeout"), null, null));
      res.on("error", err => respond(err, res, null));
      res.on("data", s => {
        data += s.toString();
      });
      res.on("end", _ => respond(null, res, data));
    })
    .on("error", err => respond(err, null, null));
};
