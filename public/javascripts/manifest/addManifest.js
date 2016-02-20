(function( addManifest, $, undefined ) {
    //Private Property
    var Validator = require("validatorjs");
    var Generador = require(global.models)("Generador");

    addManifest.searchValue = function(string){
      var result = new Generador()
      .where('razonSocial','LIKE', '%'+string+"%")
      .fetchAll()
      .then(function(generadores){
        if(generadores.length > 0)
          return generadores.pluck('razonSocial');
        return {};
      })
      .catch(function(err){
        $.notify({
          message: "No se pudo conectar a la base de datos actualmente. Favor de intentarlo de nuevo",
          icon: "pe-7s-close-circle"
        },{
          type:"danger"
        });
      });
      return result;
    }

}( window.addManifest = window.addManifest || {}, jQuery ));
