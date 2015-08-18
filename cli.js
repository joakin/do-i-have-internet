#! /usr/bin/env node

require('./index.js')(function statusChange (status) {
  console.log(status.up ? 'UP' : 'DOWN', dateStr(new Date()))
})

function dateStr (d) { return d.toLocaleDateString() + ' ' + d.toLocaleTimeString() }
