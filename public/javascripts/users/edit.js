(function( editAccount, $, undefined ) {
    //Private Property
    var User = require(global.models)("User");
    var Validator = require("validatorjs");
    var Lodash = require('lodash');

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
              console.log(user);
            })
          }
          else{
            if(users.length === 1){
              console.log("Dentro");
              console.log(contains(users,'id',global.user.attributes.id))
              if(contains(users,'id',global.user.attributes.id)){
                new User({id:global.user.attributes.id}).save({
                  name: form.name,
                  lastname: form.lastname,
                  username: form.username
                }).then(function(user){
                  $.notify({
                    icon: 'pe-7s-close-circle',
                    message:"El usuario se ha actualizado correctamente"
                  },{
                    type:"success"
                  });
                  user.refresh();
                  global.user = user;
                  $("#user-name").text(user.attributes.name + " " + user.attributes.lastname);
                })
              }
              else{
                $.notify({
                  icon: 'pe-7s-close-circle',
                  message:"El usuario se ha actualizado correctamente"
                },{
                  type:"fail"
                });
              }
            }
          }
        });
      }
      // new User({
      //   username: global.user.attributes.username,
      // })
      // .fetch()
    };

    editAccount.updatePassword = function(form) {
      console.log(form);
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
