var Fs = require('fs');
var Hogan = require('hjs');
var Bcrypt = require('bcrypt-nodejs');

$('form').submit(function(e){
  e.preventDefault();
  e.stopImmediatePropagation();
  signUp($(this).serializeObject());
})

function signUp(form){
  var User = require('../models/models.js')('User');
  new User({username:form.username}).fetch().then(function(model){
    if(model){
      var messages = {
        errorMessage: "El usuario ya existe"
      }
      loadErrors(message);
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
        global.successMessage = "El usuario ha sido creado correctamente"
        document.location.href = global.views + "login.html";
      });
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
