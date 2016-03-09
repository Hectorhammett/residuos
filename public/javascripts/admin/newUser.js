(function( editAccount, $, undefined ) {
    //Private Property
    var User = require(global.models)("User");
    var Validator = require("validatorjs");
    var Bcrypt = require("bcrypt-nodejs");

    newUser.createUser = function(form){
      var User = require(global.models)('User');
      new User({username:form.username}).fetch().then(function(model){
        if(model){
          $.notify({
            icon: 'pe-7s-close-circle',
            message: "El usuario ya existe"
          },{
            type:"danger"
          })
        }
        else{
          var data = {
            username:form.username,
            password:form.password,
            passwordRepeated: form.passwordRepeated,
            name:form.name,
            lastName:form.lastName
          }
          var rules = {
            username:"required|min:5",
            password:"required|min:5",
            passwordRepeated: "required|same:password",
            name:"required|min:3",
            lastName:"required|min:5",
          }
          var validator = new Validator(data,rules,{
            "same.passwordRepeated": "El campo Repetir Contraseña y Contraseña deben coincidir."
          });
          validator.setAttributeNames({
            username:"Nombre de Usuario",
            password:"Contraseña",
            passwordRepeated: "Repetir Contraseña",
            name:"Nombre",
            lastName:"Apellidos"
          });
          if(validator.fails()){
            var errors = validator.errors.all();
            var string = "";
            for(x in errors){
              string += errors[x] + "<br/>";
            }
            $.notify({
              icon: 'pe-7s-close-circle',
              message: string
            },{
              type:"danger"
            })
          }
          else{
            var password = form.password;
            var hash = Bcrypt.hashSync(password);
            var user = new User({
              username:form.username,
              password:hash,
              name:form.name,
              lastName:form.lastName,
              userLevel: form.userLevel
            });
            user.save().then(function(model){
              $.notify({
                icon: 'pe-7s-check',
                message: "Se ha creado el usuario correctamente"
              },{
                type:"success"
              });
              $("form").not("#form-upload-pdf")[0].reset();;
            });
          }
        }
      })
      .catch(function(err){
        alert(err);
      });
    }

}( window.newUser = window.newUser || {}, jQuery ));
