var check = require('./lib/ping')
var newEntry = require('./lib/data').newEntry

module.exports = function init (url, onStatusChange) {
  var state = {
    pings: [],
    up: null
  }
  check(url, function (entry) {
    var wasUp = state.up
    state = newEntry(state, entry)
    if (wasUp !== state.up) { onStatusChange(state) }
  })
}
