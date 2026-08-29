const csv = require('csv-parse/lib/sync')

function parseCSV(raw){
  return csv(raw, {columns:true, trim:true})
}

module.exports = { parseCSV }
