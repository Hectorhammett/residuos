(function( report, $, undefined ) {
    //Private Property
    var Generador = require(global.models)("Generador");
    var Transportista = require(global.models)("Transportista");
    var Residuo = require(global.models)("Residuo");
    var Destinatario = require(global.models)("Destinatario");
    var Manifiesto = require(global.models)("Manifiesto");
    var Validator = require("validatorjs");
    var _ = require('lodash');
    var moment = require("moment");
    var Knex = require(global.db).knex;
    moment.locale('es');

    report.initializePage = function(){
      Promise.all([
        getGenerators(),
        getTrash(),
        getTransporters(),
        getDestinations(),
      ]).then(function(values){
        var generadores = values[0].toJSON();
        var residuos = values[1].toJSON();
        var transportistas = values[2].toJSON();
        var destinatarios = values[3].toJSON();
        initSelect(modifySelect(generadores,'id','razonSocial',"all","Todos los Generadores"),"#generadores","Seleccionar Generadores");
        initSelect(modifySelect(transportistas,'id','nombre',"all","Todos los Transportistas"),"#transportistas","Seleccionar Residuos");
        initSelect(modifySelect(destinatarios,'id','nombre',"all","Todos los Destinatarios"),"#destinatarios","Seleccionar Destinatarios");
        initSelect(modifySelect(residuos,'id','name',"all","Todos los Residuos Activos"),"#residuos","Seleccionar Residuos");
        $("#generadores").val("all").trigger("change");
        $("#transportistas").val("all").trigger("change");
        $("#destinatarios").val("all").trigger("change");
        $("#residuos").val("all").trigger("change");
        initDates();
      }).catch(function(err){
        console.log(err);
        notify('pe-7s',"Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.",'danger');
      })
    }

    $(document).on("select2:select",'.select2',function(e){
      if(e.params.data.id == "all"){
        $(this).val("all").trigger("change");
      }
      else{
        $("option[value='all']",this).prop("selected", false);
        $(this).trigger("change");
      }
    })

    function getGenerators(){
      var generadores = new Generador().fetchAll().then(function(generadores){
        return generadores;
      });
      return generadores;
    }

    function getTransporters(){
      var transportistas = new Transportista().fetchAll().then(function(transportistas){
        return transportistas;
      });
      return transportistas;
    }

    function getTrash(){
      var residuos = new Residuo().fetchAll().then(function(residuos){
        return residuos;
      });
      return residuos;
    }

    function getDestinations(){
      var destinatarios = new Destinatario().fetchAll().then(function(destinatarios){
        return destinatarios;
      });
      return destinatarios;
    }

    function modifySelect(collection,id,text,mainId,mainText){
      var modified = [];
      var clear = {
        id: mainId,
        text: mainText,
      }
      modified.push(clear);
      _.forInRight(collection,function(value){
        var object = {};
        object.id = value[id];
        object.text = value[text];
        modified.push(object);
      })
      return modified;
    }

    function initSelect(options,selector,placeholder){
      $(selector).select2({
        placeholder: placeholder,
        data: options
      })
    }

    function initDates(){
      $("input[name='from']").val(moment().startOf("year").format("D/MM/YYYY"));
      $("input[name='to']").val(moment().endOf("year").format("D/MM/YYYY"));
      $(".datepicker").datepicker({
        language:"es",
        todayBtn: "linked",
        format: "d/mm/yyyy",
        clearBtn: true,
        autoclose: true
      });
    }

    report.generate = function(form){
      console.log(form);
      var rules = {
        trash: 'required',
        generators: 'required',
        transporters: 'required',
        destinations: 'required',
        from: 'required',
        to:'required'
      }
      var validator = new Validator(form,rules);
      validator.setAttributeNames({
        trash: 'Tipos de Residuos',
        generators: 'Generadores',
        transporters: 'Transportistas',
        destinations: 'Destinatarios',
        from: 'Desde',
        to: "Hasta"
      });
      if(validator.fails()){
        var string = "";
        var errors = validator.errors.all();
        for(x in errors){
          string += errors[x] + "<br/>"
        }
        notify("pe-7s-close-circle",string,"danger");
        return;
      }
      query = "SELECT m.identificador FROM manifiesto m "+
              "inner join manifiesto_has_residuos mr on m.identificador = mr.idManifiesto "+
              "inner join tiporesiduo tr on mr.idResiduo = tr.id "+
              "inner join generador ge on m.idGenerador = ge.id "+
              "inner join transportista tra on m.idTransportista = tra.id "+
              "inner join destinatario de on m.idDestinatario = de.id ";

      if(form.state != 'all'){
        switch(form.state){
          case "Liberado":
            query +="inner join pdf p on m.identificador = p.idManifiesto ";
            break;
          case "Pendiente":
            query +="left join pdf p on m.identificador = p.idManifiesto ";
          break;
        }
      }

      query += "WHERE 1=1 ";

      if(form.state == "Pendiente"){
        query += "AND p.id IS NULL ";
      }
      if(form.trash != "all"){
        query += "AND tr.id in (" + _.toString(form.trash) + ") "
      }
      if(form.generators != "all"){
        query += "AND ge.id in (" + _.toString(form.generators) + ") "
      }
      if(form.transporters != "all"){
        query += "AND tra.id in (" + _.toString(form.transporters) + ") "
      }
      if(form.destinations != "all"){
        query += "AND de.id in (" + _.toString(form.destinations) + ") "
      }

      query += "GROUP BY m.identificador";
      var promise = Knex.raw(query);
      promise.then(function(result){
        var mapped = _.map(result[0],'identificador');
        var manifiestos = new Manifiesto().query("whereIn",'identificador',mapped).query("whereBetween",'created_at',[moment(form.from,"D/MM/YYYY").toISOString(),moment(form.to,"D/MM/YYYY").toISOString()]).fetchAll({withRelated:["generador","transportista","destinatario","residuos",{archivo: function(query){query.select('id','idManifiesto');}}]}).then(function(manifiestos){
          return manifiestos.toJSON();
        });
        var residuos = new Residuo();
        if(form.trash != "all"){
          residuos = residuos.query("whereIn",'id',form.trash);
        }
        var residuos = residuos.fetchAll({withRelated:["unidad"]}).then(function(residuos){
          return residuos.toJSON();
        });

        Promise.all([
          manifiestos,
          residuos
        ]).then(function(values){
          createPDF(values);
        }).catch(function(err){
          console.log(err)
          notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
        })
      }).catch(function(err){
        console.log(err);
        notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
      })
    }

    function createPDF(values){
      console.log(values);
      var manifiestos = values[0];
      var residuosRegistrados = values[1];
      var keys = [];
      var rows = [];
      var headers = [];
      var widths = [];
      headers.push("No. Interno","No. Manifiesto","Fecha","Empresa","Estado");
      for(var i = 0; i < residuosRegistrados.length; i++){
        keys.push(residuosRegistrados[i].name);
        headers.push(residuosRegistrados[i].name + "(" + residuosRegistrados[i].unidad[0].nombre + ")");
      }
      rows.push(headers);
      for(var i = 0; i < headers.length; i++){
        widths.push('*');
      }
      for(var i = 0; i < manifiestos.length; i++){
        var residuos = _.keyBy(manifiestos[i].residuos,'name');
        var manifiesto = manifiestos[i];
        var row = [];
        row.push(manifiesto.identificador+"",manifiesto.noManifiesto+"",,manifiesto.generador.razonSocial,(manifiesto.archivo.id != undefined)? "Liberado" : "Pendiente");
        for(var j = 0; j < keys.length; j++){
          var total = (residuos[keys[j]] != undefined)? residuos[keys[j]]._pivot_cantidadUnidad+"" : "";
          row.push(total);
        }
        rows.push(row);
      }
      var docDefinition = {
        pageSize: 'LEGAL',
        pageOrientation: 'landscape',
        content: [
          {
            fontSize: 8,
            alignment: "center",
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 1,
              widths: widths,
              body: rows
            }
          }
        ]
      };
      // open the PDF in a new window
     pdfMake.createPdf(docDefinition).open();
    }
}( window.report = window.report || {}, jQuery ));
