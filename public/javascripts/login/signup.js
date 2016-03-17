var Fs = require('fs');
var Hogan = require('hjs');
var Bcrypt = require('bcrypt-nodejs');
var Validator = require('validatorjs');
Validator.useLang('es');

$('form').submit(function(e){
  e.preventDefault();
  e.stopImmediatePropagation();
  signUp($(this).serializeObject());
})

function signUp(form){
  console.log("waa!");
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
          string += errors[x] + "\n";
        }
        $.notify({
          icon: 'pe-7s-close-circle',
          message: string
        },{
          type:"danger"
        })
        alert(string);
      }
      else{
        var password = form.password;
        var hash = Bcrypt.hashSync(password);
        var user = new User({
          username:form.username,
          password:hash,
          name:form.name,
          lastName:form.lastName,
          userLevel: 1
        });
        user.save().then(function(model){
          var flashed = {};
          alert("El administrador se ha creado correctamente!");
          win.reloadIgnoringCache();
        });
      }
    }
  }).catch(function(err){
    console.log(err);
  });
}

function loadErrors(messages){
  data = messages;
  console.log(data.errorMessage);
  var html = Fs.readFileSync(global.views+"errors/errors.hjs","utf8");
  var template = Hogan.compile(html);
  var page = template.render(data);
  $("#error-holder").html(page);
}
