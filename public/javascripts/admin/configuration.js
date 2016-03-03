(function( configurations, $, undefined ) {
    //Private Property
    var Residuo = require(global.models)("Residuo");
    var Meta = require(global.models)("Meta");
    var Validator = require("validatorjs");
    Validator.useLang('es');
    var _ = require('lodash');
    var Knex = require(global.db).knex;

    configuration.initPage = function(){
      loadMeta();
      getCurrentIndex();
    }

    function loadMeta(){
      new Meta().fetchAll().then(function(meta){
        meta = meta.toJSON();
        meta = _.keyBy(meta,'data');
        console.log(meta);
        $("input[name='manifestStart']").val(meta.manifestStart.value);
        $("input[name='manifestEnd']").val(meta.manifestEnd.value);
      })
      .catch(function(err){
        console.error(err);
      })
    }

    function getCurrentIndex(){
      var index = Knex.raw("SELECT `AUTO_INCREMENT` as 'index' FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'residuos' AND TABLE_NAME = 'manifiesto'").then(function(data){
        $("input[name='localStart']").val(data[0][0].index);
      });
    }

    configuration.updateManifestRange = function(form){
      var meta = new Meta({
        id:2,
        data:"manifestStart"
      }).save({
        value: form.manifestStart
      })
      .then(function(model){
        return new Meta({
          id:1,
          data:"manifestEnd"
        }).save({
          value: form.manifestEnd
        })
        .then(function(model){
          return new Meta({
            id:3,
            data:"manifestCurrent"
          }).save({
            value: form.manifestStart
          })
          .then(function(model){

          })
        })
      })
      meta.then(function(){
        $.notify({
          icon:"pe-7s-check",
          message:"El rango de Manifiestos se han actualizado correctamente."
        },{
          type:"success"
        });
      }).catch(function(err){
        console.error(err)
        $.notify({
          icon:"pe-7s-circle-close",
          message:"Hubo un error comunicándose con la base de datos."
        },{
          type:"danger"
        });
      })
    }

    configuration.updateLocalNumber = function(form){
      Knex.raw("ALTER TABLE manifiesto AUTO_INCREMENT = " + form.localStart + ";").then(function(){
        notify("pe-7s-check","La numeración local ha sido actualizada","success");
      }).catch(function(){
        notify("pe-7s-close-circle","Hubo un error comunicándose a la base de datos","danger");
      })
    }

}( window.configuration = window.configuration || {}, jQuery ));
