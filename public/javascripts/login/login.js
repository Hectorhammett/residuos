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
.catch(function(error){
  alert("Hubo un error al conectarse a la base de datos. Favor de revisar de que el equipo en el cual se encuentra la base de datos se encuentre disponible y abra de nuevo la aplicación");
  win.close(true);
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
        $("html").load(global.hviews+"index.html",function(){
          console.log("1st redy")
        });
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

$(document).on('click','a',function(e){
  if($(this).attr('href') != "#" && $(this).attr('href') != global.views + "logout.html"){
    e.preventDefault();
    e.stopImmediatePropagation();
    if($(this).parent('li').parent('ul').hasClass('nav')){
      $('.active').removeClass('active');
      $(this).parent('li').addClass('active');
    }
    $('#page-holder').load($(this).attr('href'));
  }
})
