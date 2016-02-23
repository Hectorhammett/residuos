(function( configuration, $, undefined ) {
    //Private Property
    var Residuo = require(global.models)("Residuo");
    var Validator = require("validatorjs");

    configuration.fillTable = function(table){
      var residuos = getAllTrashTypes();
      residuos.then(function(residuos){
        var $table = $("#" + table);
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
          '<input type="checkbox" name="measures[]" value="1">Kilogramos'+
      '  </label>'+
    '  </div>'+
      '<div class="col-sm-4">'+
        '<label class="checkbox res-check">'+
          '<span class="icons"><span class="first-icon fa fa-square-o"></span><span class="second-icon fa fa-check-square-o"></span></span>'+
          '<input type="checkbox" name="measures[]" value="2">Toneladas'+
      '  </label>'+
    '  </div>'+
      '<div class="col-sm-4">'+
        '<label class="checkbox res-check">'+
          '<span class="icons"><span class="first-icon fa fa-square-o"></span><span class="second-icon fa fa-check-square-o"></span></span>'+
          '<input type="checkbox" name="measures[]" value="3">Litros'+
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
          model.unidades().attach([1,2]).then(function(){
            $.notify({
              icon:"pe-7s-checkmark",
              message:"Se ha guardado el tipo de residuo correctamente."
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
