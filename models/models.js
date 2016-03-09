var Bookshelf = require('./db');

var models = [];

var User = Bookshelf.Model.extend({
  tableName: 'user',
  idAttribute: 'id',
  hasTimestamps: true,
  manifiestos:function(){
    return this.hasMany(Manifiesto,"created_by");
  }
});

var Generador = Bookshelf.Model.extend({
  tableName: 'generador',
  idAttribute: 'id',
  hasTimestamps: false,
  manifiestos: function(){
    return this.hasMany(Manifiesto,"idGenerador");
  }
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
  unidad: function(){
    return this.belongsToMany(Unidad,'residuo_has_unidades','idResiduo','idUnidad');
  },
  manifiestos: function(){
    return this.belongsToMany(Manifiesto,'manifiesto_has_residuos','idResiduo','idManifiesto');
  }
});

var Meta = Bookshelf.Model.extend({
  tableName: 'meta_data',
  idAttribute: 'id',
  hasTimestamps: false
});

var Manifiesto = Bookshelf.Model.extend({
  tableName: 'manifiesto',
  idAttribute: 'identificador',
  hasTimestamps:true,
  user: function(){
    return this.belongsTo(User,"created_by");
  },
  generador: function(){
    return this.belongsTo(Generador,'idGenerador');
  },
  transportista: function(){
    return this.belongsTo(Transportista,'idTransportista');
  },
  residuos: function(){
    return this.belongsToMany(Residuo,'manifiesto_has_residuos','idManifiesto','idResiduo').withPivot(['cantidadContenedor','tipoContenedor','cantidadUnidad','unidad']);
  },
  destinatario: function(){
    return this.belongsTo(Destinatario,'idDestinatario');
  },
  archivo: function(){
    return this.hasOne(Archivo,'idManifiesto');
  }
});

var Transportista = Bookshelf.Model.extend({
  tableName: 'transportista',
  idAttribute: 'id',
  hasTimestamps: false,
  manifiesto: function(){
    return this.hasMany(Manifiesto);
  }
});

var Destinatario = Bookshelf.Model.extend({
  tableName: 'destinatario',
  idAttribute: 'id',
  hasTimestamps: false,
  manifiesto: function(){
    return this.hasMany(Manifiesto);
  }
});

var Archivo = Bookshelf.Model.extend({
  tableName: 'pdf',
  idAttribute: 'id',
  hasTimestamps: false,
  manifiesto: function(){
    return this.belongsTo(Manifiesto,'idManifiesto');
  }
});

models["User"] = User;
models["Generador"] = Generador;
models['Residuo'] = Residuo;
models['Unidad'] = Unidad;
models['Meta'] = Meta;
models['Transportista'] = Transportista;
models['Destinatario'] = Destinatario;
models['Manifiesto'] = Manifiesto;
models['Archivo'] = Archivo;

module.exports = function(model){
  return models[model];
}
