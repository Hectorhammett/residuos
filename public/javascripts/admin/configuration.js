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
      loadCurrentIndex();
    }

    function loadMeta(){
      getMeta().then(function(meta){
          meta = _.keyBy(meta,'data');
          $("input[name='manifestStart']").val(meta.manifestStart.value);
          $("input[name='manifestEnd']").val(meta.manifestEnd.value);
      }).catch(function(err){
        console.error(err);
        notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
      })      
    }
    
    function getMeta(){
        var meta = new Meta().fetchAll().then(function(meta){
            return meta.toJSON();
        })
        return meta;
    }
    
    function loadCurrentIndex(){
        getCurrentIndex().then(function(currentIndex){
            $("input[name='localStart']").val(currentIndex);
        }).catch(function(err){
            console.log(err);
            notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
        })
    }
    function getCurrentIndex(){
      var data = Knex.raw("SELECT `AUTO_INCREMENT` as 'index' FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'residuos' AND TABLE_NAME = 'manifiesto'").then(function(data){
        return data[0][0].index;
      });
      return data;
    }

    configuration.updateManifestRange = function(form){
      var meta = getMeta();
      meta.then(function(meta){
         meta = _.keyBy(meta,'data');
         console.log(meta,form);
         if(meta.manifestCurrent.value > form.manifestStart){
             notify("pe-7s-close-circle","El inicio del rango de manifiestos inicia en una sección ya utilizada. Favor de seleccionar un rango cuyo inicio sea mayor a " + (meta.manifestCurrent.value - 1),"danger");
         }
         else{
             var start = new Meta({
                id:2,
                data:"manifestStart"
             }).save({
                value: form.manifestStart
             })
             .then(function(model){
                 return model;
             });
             
             var end = new Meta({
                id:1,
                data:"manifestEnd"
             }).save({
                 value: form.manifestEnd
             }).then(function(model){
                 return model;
             })
             
             var current = new Meta({
                id:3,
                data:"manifestCurrent"
             }).save({
                value: form.manifestStart
             })
             .then(function(model){
                return model;
             })
             
             Promise.all([
                 start,
                 end,
                 current
             ]).then(function(values){
                 console.log("done",values);
                 notify("pe-7s-check","Se ha actualizado la información correctamente","success");
             }).catch(function(err){
                console.log(err);
                notify("pe-7s-circle-close","Hubo un error en la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
             })
         }
      }).catch(function(err){
          console.log(err);
          notify("pe-7s-circle-close","Hubo un error en la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
      });
    }

    configuration.updateLocalNumber = function(form){
      var current = getCurrentIndex();
      current.then(function(currentIndex){
          if(currentIndex > form.localStart){
              notify("pe-7s-close-circle","El número de identificación local es menor que actualmente el sistema ha llegado. Utilizar uno menor causaría problemas en la base de datos. Favor de seleccionar un número mayor a " + (currentIndex - 1),"danger");
          }
          else{
               Knex.raw("ALTER TABLE manifiesto AUTO_INCREMENT = " + form.localStart + ";").then(function(){
                    notify("pe-7s-check","La numeración local ha sido actualizada","success");
               }).catch(function(){
                    notify("pe-7s-close-circle","Hubo un error en la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
               })
          }
      }).catch(function(err){
          console.log(err);
          notify("pe-7s-close-circle","Hubo un error ocn la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
      })
    }

}( window.configuration = window.configuration || {}, jQuery ));
