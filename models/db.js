var config = require('config');
var db = config.get("db");
var knex = require('knex')({
  client: 'mysql',
  debug: true,
  connection: {
    host     : db.host,
    user     : db.username,
    password : db.password,
    database : db.dbname,
    charset  : 'UTF8_GENERAL_CI'
  },
  pool: {
    min: 2,
    max: 10,
    requestTimeout: 5000,
  }
});

module.exports = require('bookshelf')(knex);
