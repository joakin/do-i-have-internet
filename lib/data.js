exports.parse = function parse (out) {
  return toString(out).trim().split('\n').map(parseLine).filter(truthy)
}

function parseLine (line) {
  var succ = line.match(/icmp_seq=(\d+)/)
  var fail = line.match(/Request timeout for icmp_seq (\d+)/)
  return succ ? { success: true, d: parseInt(succ[1], 10) }
    : (fail ? { success: false, d: parseInt(fail[1], 10) }
       : null)
}

function toString (x) { return x.toString() }

function truthy (x) { return Boolean(x) }

exports.newEntry = function newEntry (state, entry) {
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
