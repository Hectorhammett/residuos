(function( generators, $, undefined ) {
    //Private Property
    var Residuo = require(global.models)("Residuo");
    var Generador = require(global.models)("Generador");
    var Validator = require("validatorjs");
    Validator.useLang('es');
    var _ = require('lodash');

    generators.storeGenerator = function(form){
      console.log(form);
      // var names = {
      //   name: "Razón Social de la Empresa"
      // }
      // var rules = {
      //   name: "required|min:5",
      //   domicilio: "required|min:5",
      //   municipio: "required|min:5",
      //   estado: "required|min:5",
      //   telefono: "required|numeric",
      //   nra:"required"
      // }
      // var validator = new Validator(form,rules);
      // validator.setAttributeNames(names);
      // if(validator.fails()){
      //   var string = "";
      //   var errors = validator.errors.all();
      //   for(x in errors){
      //     string += errors[x] + "<br/>";
      //   }
      //   notify("pe-7s-close-circle",string,"danger");
      // }
      // else{
      //   new Generador({
      //     razonSocial: form.name,
      //     domicilio: form.domicilio,
      //     municipio: form.municipio,
      //     estado: form.estado,
      //     telefono: form.telefono,
      //     nra: form.nra
      //   }).save().then(function(model){
      //     notify("pe-7s-check","El generador se ha guardado correctamente.","success");
      //   }).catch(function(err){
      //     console.log(err.message);
      //     notify("pe-7s-circle-close","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger")
      //   })
      // }
    }

}( window.generators = window.generators || {}, jQuery ));
