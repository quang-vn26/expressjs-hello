var low = require('lowdb')
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('db.json')
db = low(adapter)
// db_word = low(adapter)
// Set some defaults (required if your JSON file is empty)
db.defaults({ users:[]}).write()
db.defaults({ words:[]}).write()
db.defaults({ products:[]}).write()
// db.defaults({ users: [], sessions: [] })
//   .write();
db.defaults({
  users: [],
  sessions: [],
  transfers: []
})
  .write();
module.exports = db
