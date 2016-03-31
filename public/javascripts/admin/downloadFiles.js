(function( downloadFiles, $, undefined ) {
    //Private Property
    var Generador = require(global.models)("Generador");
    var Transportista = require(global.models)("Transportista");
    var Residuo = require(global.models)("Residuo");
    var Destinatario = require(global.models)("Destinatario");
    var Manifiesto = require(global.models)("Manifiesto");
    var Validator = require("validatorjs");
    var Archivo = require(global.models)("Archivo");
    var _ = require('lodash');
    var moment = require("moment");
    var Knex = require(global.db).knex;
    var fs = require("fs");
    var archiver = require('archiver');
    moment.locale('es');

    downloadFiles.initializePage = function(){
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
      $(".datepicker").val(moment().format("D/MM/YYYY"));
      $(".datepicker").datepicker({
        todayBtn: "linked",
        format: "d/mm/yyyy",
        clearBtn: true,
        autoclose: true
      });
    }

    downloadFiles.downloadFiles = function(form){
      console.log(form);
      var rules = {
        trash: 'required',
        generators: 'required',
        transporters: 'required',
        destinations: 'required',
      }
      var validator = new Validator(form,rules);
      validator.setAttributeNames({
        trash: 'Tipos de Residuos',
        generators: 'Generadores',
        transporters: 'Transportistas',
        destinations: 'Destinatarios',
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
      query = "SELECT p.id FROM pdf p "+
              "INNER JOIN manifiesto m ON m.identificador = p.idManifiesto "+
              "INNER JOIN generador g ON g.id = m.idGenerador "+
              "INNER JOIN transportista t ON t.id = m.idTransportista "+
              "INNER JOIN destinatario d ON d.id = m.idDestinatario "+
              "INNER JOIN manifiesto_has_residuos mhr ON mhr.idManifiesto = m.identificador "+
              "INNER JOIN tiporesiduo tr ON tr.id = mhr.idResiduo ";

      query += "WHERE 1=1 ";

      if(form.trash != "all"){
        query += "AND tr.id in (" + _.toString(form.trash) + ") "
      }
      if(form.generators != "all"){
        query += "AND g.id in (" + _.toString(form.generators) + ") "
      }
      if(form.transporters != "all"){
        query += "AND t.id in (" + _.toString(form.transporters) + ") "
      }
      if(form.destinations != "all"){
        query += "AND d.id in (" + _.toString(form.destinations) + ") "
      }

      query += "GROUP BY p.id";
      var promise = Knex.raw(query);
      promise.then(function(result){
        var mapped = _.map(result[0],'id');
        getPdf(mapped);
      }).catch(function(err){
        console.log(err);
        notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
      })
    }

    function getPdf(ids){
      var promises = [];
      var pdfTotal = ids.length;
      var pdfCounter = 0;
      var output = fs.createWriteStream(nw.App.dataPath + "/manifiestos.zip");
      var zipArchive = archiver('zip');

      output.on('close', function() {
        console.log(nw.App.dataPath + "/manifiestos.zip");
        chrome.downloads.download({
          url: "file://" + nw.App.dataPath + "/manifiestos.zip",
        }, function (){
          notify("pe-7s-check","Se ha guardado el archivo correctamente.","success");
        });
      });

      zipArchive.pipe(output);

      createNotification(pdfTotal);

      _.each(ids,function(value){
        var promise = new Archivo({
          id: value
        }).fetch({withRelated:["manifiesto"]}).then(function(file){
          pdfCounter++;
          updateNotification(pdfTotal,pdfCounter,parseInt((pdfCounter * 100)/pdfTotal));
          return file.toJSON();
        });
        promises.push(promise);
      })

      Promise.all(promises).then(function(results){
        _.each(results,function(file){
          var buffer = new Buffer(file.string,'base64');
          zipArchive.append(buffer, { name:"manifiesto_" + file.idManifiesto +".pdf"  });
        })
        zipArchive.finalize(function(err, bytes) {

            if(err) {
              throw err;
            }

            console.log('done:', base, bytes);

        });
      }).catch(function(err){
        console.log(err);
        notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
      })
    }

    function createNotification(total){
      var opt = {
        type: "progress",
        title: "Progreso de descarga",
        message: "Descargando manifiestos (" + total + " de 0)",
        iconUrl: "../public/images/download.png",
        progress: 0
      }
      chrome.notifications.create("notificationDownload",opt);
    }

    function updateNotification(total,current,value){
      var opt = {
        type: "progress",
        title: "Progreso de descarga",
        message: "Descargando manifiestos  (" + current + " de " + total + ")",
        iconUrl: "../public/images/download.png",
        progress: value
      }
      chrome.notifications.update("notificationDownload", opt);
    }
}( window.downloadFiles = window.downloadFiles || {}, jQuery ));
``
