(function( units, $, undefined ) {
    //Private Property
    var Chofer = require(global.models)("Chofer");
    var Transporte = require(global.models)("Transporte");
    var Ruta = require(global.models)("Ruta");
    var Validator = require("validatorjs");
    Validator.useLang('es');
    var _ = require('lodash');

    units.newDriver = function(form){
      var rules = {
        "driverName": "required"
      }

      var validator = new Validator(form,rules);

      validator.setAttributeNames({
        "driverName": "Nombre Completo"
      });

      if(validator.fails()){
        var string = "";
        var errors = validator.errors.all();
        for(x in errors){
          string += errors[x];
        }
        notify("pe-7s-close-circle",string,"danger");
      }
      else{
        new Chofer({
          nombre: form.driverName
        }).save().then(function(model){
          notify("pe-7s-check","El chofer se ha guardado correctamente","success");
          $("#newDriver")[0].reset();
        }).catch(function(err){
          console.error(err);
          notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el equipo servidor se encuentre encendido.","danger");
        });
      }
    }

    units.newUnit = function(form){
      var rules = {
        "unitType": "required",
        "unitPlates": "required"
      }

      var validator = new Validator(form,rules);

      validator.setAttributeNames({
        "unitType": "Tipo de unidad",
        "unitPlates": "Placas de la Unidad"
      });

      if(validator.fails()){
        var string = "";
        var errors = validator.errors.all();
        for(x in errors){
          string += errors[x] + "<br/>";
        }
        notify("pe-7s-close-circle",string,"danger");
      }
      else{
        new Transporte({
          tipoTransporte: form.unitType,
          placas: form.unitPlates
        }).save().then(function(model){
          notify("pe-7s-check","La unidad se ha guardado correctamente","success");
          $("#newUnit")[0].reset();
        }).catch(function(err){
          console.error(err);
          notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el equipo servidor se encuentre encendido.","danger");
        });
      }
    }

    units.newRoute = function(form){
      var rules = {
        "routeName": "required",
      }

      var validator = new Validator(form,rules);

      validator.setAttributeNames({
        "routeName": "Nombre de la Ruta"
      });

      if(validator.fails()){
        var string = "";
        var errors = validator.errors.all();
        for(x in errors){
          string += errors[x];
        }
        notify("pe-7s-close-circle",string,"danger");
      }
      else{
        new Ruta({
          nombre: form.routeName,
        }).save().then(function(model){
          notify("pe-7s-check","La Ruta se ha guardado correctamente","success");
          $("#newRoute")[0].reset();
        }).catch(function(err){
          console.error(err);
          notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el equipo servidor se encuentre encendido.","danger");
        });
      }
    }

}( window.units = window.units || {}, jQuery ));
