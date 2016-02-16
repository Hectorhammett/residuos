(function( editAccount, $, undefined ) {
    //Private Property
    var User = require(global.models)("User");
    var Validator = require("validatorjs");
    var Lodash = require('lodash');
    var Bcrypt = require('bcrypt-nodejs');

    //Method to update the user
    editAccount.updateUser = function(form) {
      Validator.useLang('es');
      var data = form;
      var rules = {
        name:"required|min:5",
        lastname:"required|min:5",
        username:"required|min:5"
      }

      var validation = new Validator(data,rules);
      validation.setAttributeNames({
        name:"Nombre",
        lastname:"Apellidos",
        username:"Nombre de Usuario"
      });
      if(validation.fails()){
        var messages =  validation.errors.all();
        var text = "";
        for(x in messages){
          text += messages[x] + "<br/>";
        }
        $.notify({
          icon: 'pe-7s-close-circle',
          message: text
        },{
          type:"danger"
        })
      }
      else{
        console.log(form.username);
        new User()
        .where('id',"!=",global.user.attributes.id)
        .where('username',form.username)
        .fetchAll()
        .then(function(users){
          console.log(users.length);
          if(users.length === 0){
            new User({id:global.user.attributes.id}).save({
              name: form.name,
              lastname: form.lastname,
              username: form.username
            }).then(function(user){
              $.notify({
                icon: 'pe-7s-check',
                message:"El usuario se ha actualizado correctamente"
              },{
                type:"success"
              });
              user.refresh();
              global.user = user;
            })
          }
          else{
            $.notify({
              icon: 'pe-7s-close-circle',
              message:"El nombre de usuario ya está siendo utilizado, favor de seleccionar otro."
            },{
              type:"danger"
            });
          }
        });
      }
      // new User({
      //   username: global.user.attributes.username,
      // })
      // .fetch()
    };

    editAccount.updatePassword = function(form) {
      // var rules = {
      //   password: "required",
      //   newPassword: "required|min:5",
      //   newPasswordRepeated: "required|same:newPassword"
      // }
      new User({
        id:global.user.attributes.id
      })
      .fetch()
      .then(function(user){
        console.log("toy dentro");
        var password = form.password;
        if(!Bcrypt.compareSync(password,user.attributes.password)){
          $.notify({
            icon: "pe-7s-close-circle",
            message: "La contraseña no es correcta",
          },{
            type:"danger"
          })
        }
        else{
          var rules = {
            newPassword:"required|min:5",
            newPasswordRepeated:"required|same:newPassword"
          }
          Validator.useLang('es');
          var validator = new Validator(form,rules);
          validator.setAttributeNames({
            password:"Contraseña",
            newPassword:"Nueva Contraseña",
            newPasswordRepeated: "Repetir Contraseña"
          });
          if(validator.fails()){
            var errors = validator.errors.all();
            var string = "";
            for(x in errors){
              string += errors[x] + "<br/>";
            }
            $.notify({
              icon:"pe-7s-close-circle",
              message:string
            },{
              type:"danger"
            });
          }
          else{
            var hash = Bcrypt.hashSync(form.newPassword);
            new User({
              id:global.user.attributes.id
            }).save({
              password: hash
            })
            .then(function(updatedUser){
              updatedUser.refresh();
              global.user = updatedUser;
              $.notify({
                icon:"pe-7s-checkmark",
                message:"La contraseña ha sido actualizado correctamente",
              },{
                type:"success"
              });
              $("#form-password-update")[0].reset();
            })
            .catch(function(err){
              alert(err);
              console.log(err);
            });
          }
        }
      })
    };

    function contains(collection,column,data){
      var query = {};
      query[column] = data;
      var check = collection.where(query);
      if(check !== undefined)
        return true
      return false;
    }
}( window.editAccount = window.editAccount || {}, jQuery ));
