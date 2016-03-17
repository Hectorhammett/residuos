(function( configDb, $, undefined ) {
    //Private Property
    var config = require('config');
    var fs = require('fs');
    var Validator = require("validatorjs");
    Validator.useLang('es');

    $(document).on('submit','form',function(e){
      e.preventDefault();
      e.stopImmediatePropagation();
      $(".spinner").css("display","block");
      var form = $(this).serializeObject();
      var rules = {
        host: "required",
        username: "required",
        dbname: "required"
      }
      var validator = new Validator(form,rules);
      validator.setAttributeNames({
        host: "Host/IP",
        username: "Usuario",
        password: "Contraseña",
        dbname: "Base de Datos"
      });
      if(validator.fails()){
        var errors = validator.errors.all();
        var string = "";
        for(x in errors){
          string += errors[x] + "\n";
        }
        $(".spinner").css("display","none");
        alert(string);
      }
      else{
        setup(form);
      }
    });

    $.fn.serializeObject = function(){
        var obj = {};

        $.each( this.serializeArray(), function(i,o){
            var n = o.name,
            v = o.value;

            obj[n] = obj[n] === undefined ? v
                : $.isArray( obj[n] ) ? obj[n].concat( v )
                : [ obj[n], v ];
        });

        return obj;
    };

    function setup(form){
      var configuration = {}
      configuration.db = {};
      configuration.db.host = form.host;
      configuration.db.username = form.username;
      configuration.db.password = form.password;
      configuration.db.dbname = form.dbname;
      var knex = require('knex')({
        client: 'mysql',
        debug: true,
        connection: {
          host     : form.host,
          user     : form.username,
          password : form.password,
          database : form.dbname,
          charset  : 'UTF8_GENERAL_CI'
        },
        pool: {
          min: 0,
          max: 7,
          requestTimeout: 5000,
        }
      });
      knex.select('id').from('user').then(function(data){
        $(".spinner").css("display","none");
        alert("El servidor ha respondido correctamente. Conexión exitosa!\n La aplicación se cerrará automáticamente. Favor de reiniciar la aplicación para que los cambios surtan efecto.");
        storeConfig(configuration);
      }).catch(function(err){
        console.log(err);
        $(".spinner").css("display","none");
        alert("El servidor no ha respondido a tiempo. Favor de revisar que la configuración es la indicada.");
      })
    }

    function storeConfig(configuration){
      fs.writeFile(global.config + "default.json",JSON.stringify(configuration),function(err){
        if(err)
        alert("Hubo un error guardando la configuración. Favor de revisar los permisos del usuario en la PC.");
        else {
          win.close(true);
        }
      })
    }
}( window.configDb = window.configDb || {}, jQuery ));
