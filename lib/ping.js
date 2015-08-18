var spawn = require('child_process').spawn
var parse = require('./data').parse

module.exports = function check (url, onData) {
  var goog = ping(url)
  goog.stdout.on('data', stdout.bind(null, onData))
  goog.stderr.on('data', function (data) {
    // console.error('error:', toString(data).trim())
    onData({ success: false })
  })
  goog.on('close', function () {
    // console.error('FAIL: Ping exited. Retrying...')
    setTimeout(check.bind(null, url, onData), 1500)
  })
}

function ping (url) { return spawn('ping', [url]) }

function stdout (onData, out) {
  var lines = parse(out)
  lines.forEach(function (line) { onData(line) })
}
