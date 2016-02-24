(function( configuration, $, undefined ) {
    //Private Property
    var Residuo = require(global.models)("Residuo");
    var Meta = require(global.models)("Meta");
    var Validator = require("validatorjs");
    var _ = require('lodash');
    var Knex = require(global.db).knex;

    configuration.initPage = function(){
      configuration.fillTable("table-residuos");
      loadMeta();
      getCurrentIndex();
    }

    function loadMeta(){
      new Meta().fetchAll().then(function(meta){
        meta = meta.toJSON();
        meta = _.keyBy(meta,'data');
        console.log(meta);
        $("input[name='manifestStart']").val(meta.manifestStart.value);
        $("input[name='manifestEnd']").val(meta.manifestEnd.value);
      })
      .catch(function(err){
        console.error(err);
      })
    }

    function getCurrentIndex(){
      var index = Knex.raw("SELECT `AUTO_INCREMENT` as 'index' FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'residuos' AND TABLE_NAME = 'manifiesto'").then(function(data){
        $("input[name='localStart']").val(data[0][0].index);
      });
    }

    configuration.updateManifestRange = function(form){
      var meta = new Meta({
        id:2,
        data:"manifestStart"
      }).save({
        value: form.manifestStart
      })
      .then(function(model){
        return new Meta({
          id:1,
          data:"manifestEnd"
        }).save({
          value: form.manifestEnd
        })
        .then(function(model){
          return new Meta({
            id:3,
            data:"manifestCurrent"
          }).save({
            value: form.manifestStart
          })
          .then(function(model){

          })
        })
      })
      meta.then(function(){
        $.notify({
          icon:"pe-7s-check",
          message:"El rango de Manifiestos se han actualizado correctamente."
        },{
          type:"success"
        });
      }).catch(function(err){
        console.error(err)
        $.notify({
          icon:"pe-7s-circle-close",
          message:"Hubo un error comunicándose con la base de datos."
        },{
          type:"danger"
        });
      })
    }

    configuration.updateLocalNumber = function(form){
      Knex.raw("ALTER TABLE manifiesto AUTO_INCREMENT = " + form.localStart + ";").then(function(){
        notify("pe-7s-check","La numeración local ha sido actualizada","success");
      }).catch(function(){
        notify("pe-7s-close-circle","Hubo un error comunicándose a la base de datos","danger");
      })
    }

    configuration.fillTable = function(table){
      var residuos = getAllTrashTypes();
      residuos.then(function(residuos){
        var $table = $("#" + table);
        residuos.fetch({
          withRelated:['unidades']
        })
        .then(function(residuos){
          var residuos = residuos.toJSON();
          for(x in residuos){
            var row = document.createElement("tr");
            var name = document.createElement("td");
            var types = document.createElement("td");
            //var containers = document.createElement("td");
            $(name).html('<input type="text" value="' + residuos[x].name  + '" class="form-control" />');
            $(types).html('<div class="col-sm-4">'+
              '<label class="checkbox res-check">'+
                '<span class="icons"><span class="first-icon fa fa-square-o"></span><span class="second-icon fa fa-check-square-o"></span></span>'+
                '<input type="checkbox">Kilogramos'+
            '  </label>'+
          '  </div>'+
            '<div class="col-sm-4">'+
              '<label class="checkbox res-check">'+
                '<span class="icons"><span class="first-icon fa fa-square-o"></span><span class="second-icon fa fa-check-square-o"></span></span>'+
                '<input type="checkbox">Toneladas'+
            '  </label>'+
          '  </div>'+
            '<div class="col-sm-4">'+
              '<label class="checkbox res-check">'+
                '<span class="icons"><span class="first-icon fa fa-square-o"></span><span class="second-icon fa fa-check-square-o"></span></span>'+
                '<input type="checkbox">Litros'+
              '</label>'+
            '</div>');
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
      $(types).html('<div class="col-sm-4">'+
        '<label class="checkbox res-check">'+
          '<span class="icons"><span class="first-icon fa fa-square-o"></span><span class="second-icon fa fa-check-square-o"></span></span>'+
          '<input type="checkbox" name="measures[]" value="2">Kilogramos'+
      '  </label>'+
    '  </div>'+
      '<div class="col-sm-4">'+
        '<label class="checkbox res-check">'+
          '<span class="icons"><span class="first-icon fa fa-square-o"></span><span class="second-icon fa fa-check-square-o"></span></span>'+
          '<input type="checkbox" name="measures[]" value="3">Toneladas'+
      '  </label>'+
    '  </div>'+
      '<div class="col-sm-4">'+
        '<label class="checkbox res-check">'+
          '<span class="icons"><span class="first-icon fa fa-square-o"></span><span class="second-icon fa fa-check-square-o"></span></span>'+
          '<input type="checkbox" name="measures[]" value="1">Litros'+
        '</label>'+
      '</div>');
      //$(containers).html('<input type="text" value="" name="containers" class="form-control" />');
      $(row).append(name);
      $(row).append(types);
      //$(row).append(containers);
      $(row).append('<td><button class="btn btn-danger btn-block delete-blank">Eliminar</button></td>')
      $(row).addClass("new-row");
      $table.append(row);
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
        var checks = $("input[type='checkbox']",row);
        var checked = new Array();
        for(x in checks){
          if(checks[x].checked){
            checked.push(checks[x].value);
          }
          values["units"] = checked;
        }
        new Residuo({
          name:values.name,
          estado:1
        })
        .save()
        .then(function(model){
          model.unidades().attach(values.units).then(function(){
            $("#table-residuos").empty();
            configuration.fillTable("table-residuos");
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
      });
    })
}( window.configuration = window.configuration || {}, jQuery ));
