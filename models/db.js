var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'residuos',
    charset  : 'UTF8_GENERAL_CI'
  },
  pool: {
    min: 0,
    max: 7
  }
});

module.exports = require('bookshelf')(knex);
