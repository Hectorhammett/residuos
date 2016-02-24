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

var Unidad = Bookshelf.Model.extend({
  tableName: 'unidad',
  idAttribute: 'id',
  hasTimestamps: false,
  residuos: function(){
    return this.belongsToMany(Residuo,'residuo_has_unidades','idUnidad','idResiduo');
  }
});

var Residuo = Bookshelf.Model.extend({
  tableName: 'tiporesiduo',
  idAttribute: 'id',
  hasTimestamps: false,
  unidades: function(){
    return this.belongsToMany(Unidad,'residuo_has_unidades','idResiduo','idUnidad');
  }
});

var Meta = Bookshelf.Model.extend({
  tableName: 'meta_data',
  idAttribute: 'id',
  hasTimestamps: false
});

models["User"] = User;
models["Generador"] = Generador;
models['Residuo'] = Residuo;
models['Unidad'] = Unidad;
models['Meta'] = Meta;

module.exports = function(model){
  return models[model];
}
