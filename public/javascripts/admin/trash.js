(function( trash, $, undefined ) {
    //Private Property
    var Residuo = require(global.models)("Residuo");
    var Meta = require(global.models)("Meta");
    var Validator = require("validatorjs");
    Validator.useLang('es');
    var _ = require('lodash');
    var Knex = require(global.db).knex;

    trash.initPage = function(){
      trash.fillTable("table-residuos");
    }

    trash.fillTable = function(table){
      var residuos = getAllTrashTypes();
      residuos.then(function(residuos){
        var $table = $("#" + table);
        residuos.fetch({
          withRelated:['unidad']
        })
        .then(function(residuos){
          var residuos = residuos.toJSON();
          for(x in residuos){
            var row = document.createElement("tr");
            var name = document.createElement("td");
            var types = document.createElement("td");
            //var containers = document.createElement("td");
            $(name).html('<input type="text" value="' + residuos[x].name  + '" class="form-control" disabled="disabled"/>');
            $(types).html('<div class="col-sm-6">'+
              '<label class="radio res-check disabled">'+
                  '<span class="icons"><span class="first-icon fa fa-circle-o"></span><span class="second-icon fa fa-dot-circle-o"></span></span><input type="radio" data-toggle="radio" name="unidad" value="2" disabled="disabled">Kilogramos'+
              '</label>'+
          '  </div>'+
          '<div class="col-sm-6">'+
            '<label class="radio res-check disabled">'+
                '<span class="icons"><span class="first-icon fa fa-circle-o"></span><span class="second-icon fa fa-dot-circle-o"></span></span><input type="radio" data-toggle="radio" name="unidad" value="1" disabled="disabled">Litros'+
            '</label>'+
        '  </div>');
            //$(containers).html('<input type="text" value="" class="form-control"/>');
            $(row).append(name);
            $(row).append(types);
            //$(row).append(containers);
            if(residuos[x].estado == 1){
              $(row).append('<td><button class="btn btn-warning btn-block btn-disable" id="' + residuos[x].id + '">Deshabilitar</button></td>');
            }
            else{
              $(row).append('<td><button class="btn btn-success btn-block btn-enable" id="' + residuos[x].id + '">Habilitar</button></td>');
            }
            $("input[name='unidad'][value='" + residuos[x].unidad[0].id + "']",row).closest('label').addClass("checked");
            $table.append(row);
          }
        });
      });
    }

    function newTrashType(table){
      var $table = $("#" + table);
      var form = document.createElement("form");
      var row = document.createElement("tr");
      var name = document.createElement("td");
      var types = document.createElement("td");
      //var containers = document.createElement("td");
      $(name).html('<input type="text" value="" class="form-control" placeholder="Nombre de residuo" name="name"/>');
      $(types).html('<div class="col-sm-6">'+
        '<label class="radio res-check">'+
            '<span class="icons"><span class="first-icon fa fa-circle-o"></span><span class="second-icon fa fa-dot-circle-o"></span></span><input type="radio" data-toggle="radio" name="unidad" value="2" >Kilogramos'+
        '</label>'+
    '  </div>'+
    '<div class="col-sm-6">'+
      '<label class="radio res-check">'+
          '<span class="icons"><span class="first-icon fa fa-circle-o"></span><span class="second-icon fa fa-dot-circle-o"></span></span><input type="radio" data-toggle="radio" name="unidad" value="1">Litros'+
      '</label>'+
  '  </div>');
      //$(containers).html('<input type="text" value="" name="containers" class="form-control" />');
      $(row).append(name);
      $(row).append(types);
      //$(row).append(containers);
      $(row).append('<td><button class="btn btn-danger btn-block delete-blank">Eliminar</button></td>')
      $(row).addClass("new-row");
      $(row).prependTo($table);
      $("input[name='containers']").tagsInput();
    }

    function getAllTrashTypes(){
      var residuos = new Residuo().fetchAll().then(function(residuos){
        return residuos
      });
      return residuos;
    }

    $(document).on('click','#residuo-new',function(){
      newTrashType("table-residuos");
    })

    $(document).on('click','.btn-disable',function(){
      var id = this.id;
      var button = this;
      var residuo = new Residuo({
        id: id
      })
      .save({
        estado: 0
      }).then(function(){
        $(button).removeClass('btn-dissable btn-warning');
        $(button).addClass('btn-enable btn-success');
        $(button).text("Habilitar");
      })
      .catch(function(){
        $.notify({
          icon:"pe-7s-close-circle",
          message: "Hubo un error conectándose a la base de datos, favor de revisar que el servidor esté funcionando",
        },{
          type:"danger"
        })
      })
    })

    $(document).on('click','.btn-enable',function(){
      var id = this.id;
      var button = this;
      var residuo = new Residuo({
        id: id
      })
      .save({
        estado: 1
      }).then(function(){
        $(button).removeClass('btn-enable btn-success');
        $(button).addClass('btn-dissable btn-warning');
        $(button).text("Deshabilitar");
      })
      .catch(function(){
        $.notify({
          icon:"pe-7s-close-circle",
          message: "Hubo un error conectándose a la base de datos, favor de revisar que el servidor esté funcionando",
        },{
          type:"danger"
        })
      })
    })

    $(document).on('click','.delete-blank',function(){
      var row = $(this).closest("tr");
      $(row).remove();
    })

    $(document).on('click','#residuo-save',function(){
      $(".new-row").each(function(i,row){
        var values = new Array();
        values["name"] = $("input[name='name']",row).val();
        values["unidad"] = $("input[name='unidad']:checked",row).val();
        var validation = new Validator(values,{
          name: "required",
          unidad: "required"
        });
        validation.setAttributeNames({
          name: "Nombre de residuo"
        });
        if(validation.fails()){
          var messages = validation.errors.all();
          var string = "";
          for(x in messages){
            string += messages[x];
          }
          notify("pe-7s-close-circle",string,"danger");
        }
        else{
          new Residuo({
            name:values.name,
            estado:1
          })
          .save()
          .then(function(model){
            model.unidad().attach(values.unidad).then(function(){
              $("#table-residuos").empty();
              trash.fillTable("table-residuos");
              $.notify({
                icon:"pe-7s-check",
                message:"Se han guardado los tipos de residuo correctamente."
              },{
                type:"success"
              })
            });
          })
          .catch(function(err){
            console.log(err);
            console.error(err.message);
            $.notify({
              icon:'pe-7s-close-circle',
              message: "Hubo un error conectándose a la base de datos, favor de revisar que el servidor esté funcionando"
            },{
              type:"danger"
            })
          })
        }
      });
    })
}( window.trash = window.trash || {}, jQuery ));
