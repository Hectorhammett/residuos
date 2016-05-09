(function( responsables, $, undefined ) {
    //Private Property
    var Responsable = require(global.models)("Responsable");
    var Validator = require("validatorjs");
    Validator.useLang('es');
    var _ = require('lodash');

    responsables.saveResponsable = function(form){
      var rules = {
        name: "required|min:5",
      }

      var validator = new Validator(form,rules);

      validator.setAttributeNames({
        name: "Nombre del Responsable",
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
        new Responsable({
          nombre: form.name,
        }).save().then(function(){
          notify("pe-7s-check","El responsable se ha guardado correctamente","success");
          $("form").not("#form-upload-pdf")[0].reset();;
        }).catch(function(err){
          console.error(err);
          notify("pe-7s","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
        })
      }
    }

}( window.responsables = window.responsables || {}, jQuery ));
