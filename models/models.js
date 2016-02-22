var Bookshelf = require('./db');

var models = [];

var User = Bookshelf.Model.extend({
  tableName: 'user',
  idAttribute: 'id',
  hasTimestamps: true
});

var Generador = Bookshelf.Model.extend({
  tableName: 'generador',
  idAttribute: 'id',
  hasTimestamps: false
});

var Residuo = Bookshelf.Model.extend({
  tableName: 'tiporesiduo',
  idAttribute: 'id',
  hasTimestamps: false
});

models["User"] = User;
models["Generador"] = Generador;
models['Residuo'] = Residuo;

module.exports = function(model){
  return models[model];
}
