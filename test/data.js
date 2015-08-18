var test = require('tape')

var data = require('../lib/data')

var s = '64 bytes from 216.58.211.238: icmp_seq=196 ttl=56 time=31.069 ms'
var f = 'Request timeout for icmp_seq 197'

test('#parse: extra newlines are not parsed', function (t) {
  var parsed = data.parse(new Buffer(s + '\n'))
  t.equals(parsed.length, 1, 'Only one result from new line buffer')
  t.end()
})

test('#parse: can parse several lines at once', function (t) {
  var parsed = data.parse(new Buffer(s + '\n' + f))
  t.equals(parsed.length, 2, 'two commands parsed')
  t.end()
})

test('#parse: can parse a success', function (t) {
  var parsed = data.parse(new Buffer(s))
  t.equals(parsed[0].success, true, 'first a success')
  t.end()
})

test('#parse: can parse a failure', function (t) {
  var parsed = data.parse(new Buffer(f))
  t.equals(parsed[0].success, false, 'second a failure')
  t.end()
})

test('#parse: unrecognized commands are ignored', function (t) {
  var parsed = data.parse(new Buffer('PING google.com (216.58.211.238): 56 data bytes'))
  t.equals(parsed.length, 0, 'no unrecognized commands')
  t.end()
})

var state = { pings: [], up: null }

test('#newEntry: a new entry is added to the pings history', function (t) {
  var newState = data.newEntry(state, { success: true })
  t.equals(newState.pings.length, 1, 'entry was added')
  t.equals(newState.pings[0].success, true, 'entry was added')
  t.equals(state.pings.length, 0, 'old state is not modified')
  t.end()
})

var range = require('array-range')

var fullState = {
  up: null,
  pings: range(100).map(function () { return { success: true } })
}

test('#newEntry: only the last 100 entries are kept', function (t) {
  var newState = data.newEntry(fullState, { success: false })
  t.equals(newState.pings.length, 100, 'max entries is 100')
  t.equals(newState.pings[99].success, false, 'last entry is the new one')
  t.equals(fullState.pings[99].success, true, 'state was not modified')
  t.end()
})

var internetDownState = {
  up: null,
  pings: range(6)
    .map(function () { return { success: true } })
    .concat(range(4).map(function () { return { success: false } }))
}

var internetUpState = {
  up: null,
  pings: range(7)
    .map(function () { return { success: true } })
    .concat(range(3).map(function () { return { success: false } }))
}

test('#newEntry: with 5 consecutive failures `up` state changes', function (t) {
  var newState = data.newEntry(internetDownState, { success: false })
  var newState2 = data.newEntry(internetUpState, { success: false })
  t.equals(newState.up, false, 'after 5 failures it reports up false')
  t.equals(newState2.up, true, 'less than 5 failures reports up true')
  t.end()
})
