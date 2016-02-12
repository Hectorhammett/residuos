var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'restest',
    charset  : 'UTF8_GENERAL_CI'
  }
});

module.exports = require('bookshelf')(knex);
