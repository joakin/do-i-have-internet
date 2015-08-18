var spawn = require('child_process').spawn

module.exports = function init (onStatusChange) {
  var state = {
    pings: [],
    up: null
  }
  check(function (entry) {
    var wasUp = state.up
    state = newEntry(state, entry)
    if (wasUp !== state.up) { onStatusChange(state) }
  })
}

function ping () { return spawn('ping', ['www.google.com']) }

function toString (x) { return x.toString() }
function truthy (x) { return Boolean(x) }

function check (onData) {
  var goog = ping()
  goog.stdout.on('data', stdout.bind(null, onData))
  goog.stderr.on('data', function (data) {
    // console.error('error:', toString(data).trim())
    onData({ success: false })
  })
  goog.on('close', function () {
    // console.error('FAIL: Ping exited. Retrying...')
    setTimeout(check.bind(null, onData), 1500)
  })
}

function stdout (onData, out) {
  var lines = parse(out)
  lines.forEach(function (line) { onData(line) })
}

function parse (out) {
  return toString(out).trim().split('\n').map(parseLine).filter(truthy)
}

function parseLine (line) {
  var succ = line.match(/icmp_seq=(\d+)/)
  var fail = line.match(/Request timeout for icmp_seq (\d+)/)
  return succ ? { success: true, d: parseInt(succ[1], 10) }
    : (fail ? { success: false, d: parseInt(fail[1], 10) }
       : null)
}

function newEntry (state, entry) {
  var pings = state.pings.concat(entry)
  var len = pings.length
  return {
    pings: pings.slice(Math.max(0, len - 100), len),
    up: isFailure(pings) ? false : true
  }
}

function isFailure (pings) {
  var len = pings.length
  var last5 = len > 5 ? pings.slice(len - 5, len) : pings
  return last5.every(function (p) { return !p.success })
}
