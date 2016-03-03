(function( transporters, $, undefined ) {
    //Private Property
    var Transportista = require(global.models)("Transportista");
    var Validator = require("validatorjs");
    Validator.useLang('es');
    var _ = require('lodash');

    transporters.saveTransporter = function(form){
      var rules = {
        nombre: "required|min:5",
        sct: "required",
        domicilio: "required|min:5",
        telefono: "required|numeric"
      }

      var validator = new Validator(form,rules);

      validator.setAttributeNames({
        nombre: "Nombre de la Empresa Transportadora",
        sct: "Número de Registro S.C.T."
      })

      if(validator.fails()){
        var errors = validator.errors.all();
        var string = "";
        for(x in errors){
          string += errors[x] + "<br/>";
        }
        notify("pe-7s-close-circle",string,"danger");
      }
      else{
        new Transportista({
          nombre: form.nombre,
          sct: form.sct,
          domicilio: form.domicilio,
          telefono: form.telefono
        }).save().then(function(){
          notify("pe-7s-check","El transportista se ha guardado correctamente","success");
          $("form")[0].reset();
        }).catch(function(err){
          console.error(err);
          notify("pe-7s","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
        })
      }
    }

}( window.transporters = window.transrporters || {}, jQuery ));
