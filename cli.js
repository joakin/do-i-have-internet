#! /usr/bin/env node

var dateStr = require('./lib/date-str')

require('./index.js')('www.google.com', function statusChange (status) {
  console.log(status.up ? 'UP' : 'DOWN', dateStr(new Date()))
})
