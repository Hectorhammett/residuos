var Fs = require('fs');
var Hogan = require('hjs');
var User = require(global.models)('User');
var Bcrypt = require('bcrypt-nodejs');

new User().count().then(function(total){
  if(total == 0){
    alert("Es la primera vez que se inicia el sistema, favor de registrar un Administrador para éste");
    document.location.href = global.views + "firstSignIn.html";
  }
})

if(global.successMessage != undefined){
  loadErrors({successMessage: global.successMessage});
}

if(global.errorMessage != undefined){
  loadErrors({errorMessage: global.errorMessage});
}

$('form').submit(function(e){
  e.preventDefault();
  e.stopImmediatePropagation();
  login($(this).serializeObject());
})

function login(form){
  new User({username:form.username}).fetch().then(function(model){
    if(!model){
      var messages = {
        errorMessage: "El usuario no existe.",
      }
      loadErrors(messages);
    }
    else{
      var serializedUser = model.toJSON();
      var password = form.password;
      if(!Bcrypt.compareSync(password,serializedUser.password)){
        var messages = {
          errorMessage: "Contraseña incorrecta.",
        }
        loadErrors(messages);
      }
      else{
        global.user = model;
        document.location.href = global.views + "index.html";
      }
    }
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
