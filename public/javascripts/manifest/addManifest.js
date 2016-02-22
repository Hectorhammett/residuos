(function( addManifest, $, undefined ) {
    //Private Property
    var Validator = require("validatorjs");
    var Generador = require(global.models)("Generador");
    var Residuo = require(global.models)("Residuo");
    var Knex = require(global.db).knex;

    addManifest.searchValue = function(string){
      var result = new Generador()
      .where('razonSocial','LIKE', '%'+string+"%")
      .fetchAll()
      .then(function(generadores){
        if(generadores.length > 0){}
          return modifyTypeAhead(generadores.toJSON());
        return {};
      })
      .catch(function(err){
        console.log(err);
        $.notify({
          message: "No se pudo conectar a la base de datos actualmente. Favor de intentarlo de nuevo",
          icon: "pe-7s-close-circle"
        },{
          type:"danger"
        });
      });
      return result;
    }

    addManifest.getNextIndex = function(){
      var index = Knex.raw("SELECT `AUTO_INCREMENT` as 'index' FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'residuos' AND TABLE_NAME = 'manifiesto'").then(function(data){
        return data[0][0].index;
      });
      return index;
    }

    addManifest.getTrashType = function(){
      var residuos = new Residuo().fetchAll().then(function(residuos){
        console.log(residuos);
        return modifySelect2(residuos.toJSON());
      })
      .catch(function(err){
        console.error(err);
        $.notify({
          message:"Hubo en error conectándose a la base de datos. Favor de revisar que el servidor se encuentre funcionando",
          icon:"pe-7s-close-circle"
        },{
          type:"danger"
        });
      })
      return residuos;
    }

    function modifyTypeAhead(collection){
      var manipulated = new Array();
      for(x in collection){
        manipulated.push({
          name: collection[x].razonSocial,
          id: collection[x].id,
          domicilio: collection[x].domicilio,
          municipio: collection[x].municipio,
          estado: collection[x].estado,
          telefono: collection[x].telefono,
          nra: collection[x].nra
        });
      }
      console.log(JSON.stringify(manipulated));
      return manipulated;
    }

    function modifySelect2(data){
      var manipulated = new Array();
      console.log(data);
      manipulated.push({
        id: "",
        text: "",
      });
      for(x in data){
        manipulated.push({
          id: data[x].id,
          text: data[x].name,
        });
      }
      console.log(JSON.stringify(manipulated));
      return manipulated;
    }

}( window.addManifest = window.addManifest || {}, jQuery ));
