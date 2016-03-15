var knex = require('knex')({
  client: 'mysql',
  debug: true,
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'residuos',
    charset  : 'UTF8_GENERAL_CI'
  },
  pool: {
    min: 0,
    max: 7,
    requestTimeout: 5000,
  }
});

module.exports = require('bookshelf')(knex);
