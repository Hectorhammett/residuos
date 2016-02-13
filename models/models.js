var Bookshelf = require('./db');

var models = [];

var User = Bookshelf.Model.extend({
  tableName: 'user',
  idAttribute: 'id',
  hasTimestamps: true
});

models["User"] = User;

module.exports = function(model){
  return models[model];
}
