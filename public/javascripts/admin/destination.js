(function( destination, $, undefined ) {
    //Private Property
    var Destinatario = require(global.models)("Destinatario");
    var Validator = require("validatorjs");
    Validator.useLang('es');
    var _ = require('lodash');

    destination.saveDestination = function(form){
      var rules = {
        nombre: "required|min:5",
        ine: "required",
        domicilio: "required|min:5",
        telefono: "required|numeric"
      }

      var validator = new Validator(form,rules);

      validator.setAttributeNames({
        nombre: "Nombre de la Empresa",
        ine: "Número de la Autorización de la SEMARNAT",
        domicilio: "Domicilio",
        telefono: "Teléfono"
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
        new Destinatario({
          nombre: form.nombre,
          ine: form.ine,
          domicilio: form.domicilio,
          telefono: form.telefono
        }).save().then(function(){
          notify("pe-7s-check","El destinatario se ha guardado correctamente","success");
          $("form").not("#form-upload-pdf")[0].reset();
        }).catch(function(err){
          console.error(err);
          notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
        })
      }
    }

}( window.destination = window.transrporters || {}, jQuery ));
