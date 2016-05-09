(function( searchManifest, $, undefined ) {
    //Private Property
    var Manifiesto = require(global.models)("Manifiesto");
    var Validator = require("validatorjs");
    var Archivo = require(global.models)("Archivo");
    Validator.useLang('es');
    var _ = require('lodash');
    var Knex = require(global.db).knex;
    var moment = require('moment');
    var PDFDocument = require('pdfkit');
    var Archivo = require(global.models)("Archivo")
    var Fs = require("fs");

    //This is called from the view
    searchManifest.initalizePage = function(){
      var manifiestos = getRows();
      manifiestos.then(function(manifiestos){
        console.log(manifiestos.length);
        $("#manifests").DataTable({
          data: manifiestos,
          deferred: true,
          "columns": [
            { "data": "identificador" },
            { "data": "noManifiesto" },
            { "data": "generador.razonSocial" },
            { "data": "transportista.nombre" },
            { "data": "destinatario.nombre" },
            { "data": "created_at" },
            { "data": "updated_at" },
            { "data": "userfullname" },
            { "data": "pdf" },
            { "data": "buttons" }
          ],
          language:{
            "sProcessing":     "Procesando...",
           "sLengthMenu":     "Mostrar _MENU_ registros",
           "sZeroRecords":    "No se encontraron resultados",
           "sEmptyTable":     "Ningún dato disponible en esta tabla",
           "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
           "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
           "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
           "sInfoPostFix":    "",
           "sSearch":         "Buscar:",
           "sUrl":            "",
           "sInfoThousands":  ",",
           "sLoadingRecords": "Cargando...",
           "oPaginate": {
               "sFirst":    "Primero",
               "sLast":     "Último",
               "sNext":     "Siguiente",
               "sPrevious": "Anterior"
           },
           "oAria": {
               "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
               "sSortDescending": ": Activar para ordenar la columna de manera descendente"
           }
          }
        });
      });
    }

    //handler for the Editar button
    $(document).on('click','.btn-edit',function(){
      global.editManifestId = this.id;
      $("#page-holder").load( global.hviews + "manifest/editManifest.html");
    })

    //handler for the Consultar button
    $(document).on('click','.btn-consult',function(){
      showManifest(this.id);
    })

    $(document).on('click','.btn-download',function(){
      var value = this.id;
      new Manifiesto({
        identificador: value
      }).fetch({withRelated:['archivo']}).then(function(manifiesto){
        var manifiesto = manifiesto.toJSON();
        var archivo = manifiesto.archivo;
        if(archivo.id != undefined){
          var buffer = new Buffer(archivo.string,'base64');
          Fs.writeFile(global.views + "manifest/" + manifiesto.noManifiesto + '.pdf',buffer,function(){
            chrome.downloads.download({
              url: global.views + "manifest/" + manifiesto.noManifiesto + '.pdf',
            });
          })
        }
        else{
          notify('pe-7s-close-circle',"Este manifiesto no cuenta con un PDF escaneado.",'danger');
        }
      }).catch(function(err){
        console.log(err);
        notify('pe-7s-close-circle','Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.','danger');
      })
    })

    //Handler for the options button
    $(document).on('click','.btn-options',function(){
      var $this = $(this);
      if (!$this.data("bs.popover")) {
        var options = {
          placement: "left",
          content: '<div class="popover-content"><div class="btn-group btn-group-justified" role="group" aria-label="...">'+
            '<div class="btn-group" role="group">'+
              '<button type="button" class="btn btn-sm btn-simple btn-consult" id="' + this.id + '"">Consultar</button>'+
            '</div>'+
            '<div class="btn-group" role="group">'+
              '<button type="button" class="btn btn-sm btn-simple btn-edit" id="' + this.id + '"">Editar</button>'+
            '</div>'+
            '<div class="btn-group" role="group">'+
              '<button type="button" class="btn btn-sm btn-simple btn-upload" id="' + this.id + '"">Subir PDF</button>'+
            '</div>'+
            '<div class="btn-group" role="group">'+
              '<button type="button" class="btn btn-sm btn-simple btn-download" id="' + this.id + '"">Descargar PDF</button>'+
            '</div>'+
          '</div></div>',
          html: true,
          trigger: "click"
        }
        $this.popover(options);
        $this.click();
      }
    })

    $('html').on('click', function(e) {
        if (typeof $(e.target).data('original-title') == 'undefined' &&
           !$(e.target).parents().is('.popover.in')) {
          $('[data-original-title]').popover('destroy');
        }
      });

    //handler for the btn upload to upload a file
    $(document).on('click','.btn-upload',function(){
      $("#upload-manifest-id").val(this.id);
      $("#modal-upload-scan").modal('show');
      $("#form-upload-pdf").dropzone({
        addRemoveLinks: true,
        acceptedFiles: 'application/pdf',
        autoProcessQueue: false,
        parallelUploads:1,
        uploadMultiple:false,
        maxFiles:1,
        init: function() {
          var dropzone = this;
          $(document).on('click','#btn-upload-manifest',function(){
            uploadManifest(dropzone,$("#upload-manifest-id").val());
          })
          $(document).on('dropReset',"#form-upload-pdf",function(){
            dropzone.removeAllFiles();
          });
          this.on("maxfilesexceeded", function(file) {
            this.removeAllFiles();
            this.addFile(file);
          });
          this.on("dragenter", function(file) {
            $("#form-upload-pdf").removeClass("not-hovered");
            $("#form-upload-pdf").addClass("hovered");
          });
          this.on("dragleave", function(file) {
            $("#form-upload-pdf").removeClass("hovered");
            $("#form-upload-pdf").addClass("not-hovered");
          });
          this.on("addedfile", function(file) {
            $("#form-upload-pdf").removeClass("not-hovered");
            $("#form-upload-pdf").addClass("hovered");
          });
          this.on("removedfile", function(file) {
            $("#form-upload-pdf").removeClass("hovered");
            $("#form-upload-pdf").addClass("not-hovered");
          });
          this.on("removedfile", function(file) {
            $("#form-upload-pdf").removeClass("hovered");
            $("#form-upload-pdf").addClass("not-hovered");
          });
        }
      });
    });

    //function to upload the manifest as a blob
    function uploadManifest(dropzone,idManifest){
      console.log(idManifest);
      var files = dropzone.getAcceptedFiles()
      var path = files[0].path;
      Fs.readFile(path, function(err, buffer) {
        if (err) {
          console.error(err);
          return;
        }
        console.log("readed the file");
        Knex('pdf').where('idManifiesto',idManifest).del().then(function(){
          Knex('pdf').insert({
            string: buffer.toString("base64"),
            fileType: "pdf",
            idManifiesto: idManifest
          }).then(function(){
            $("#modal-upload-scan").modal('hide');
            $("#form-upload-pdf").trigger("dropReset");
            notify("pe-7s-check","Se ha guardado el manifiesto correctamente","success");
            $("#consultar-manifiesto").click();
          }).catch(function(err){
            console.error(err);
            notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
          });
        }).catch(function(err){
          console.log(err);
          notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
        })
      });
    }

    //function to open the manifest when the consult button is clicked
    function showManifest(searchId){
      console.log(searchId);
      new Manifiesto({
        identificador: searchId,
      }).fetch({withRelated:["transportista","residuos","generador","destinatario","chofer","transporte","ruta","responsable"]}).then(function(manifiesto){
        manifiesto = manifiesto.toJSON();
        console.log(manifiesto);
        if(!manifiesto){
          notify("pe-7s-close-circle","No se encontró el manifiesto. Favor de consultar al administrador del sistema","danger");
        }
        else{
          showPdf(manifiesto);
        }
      }).catch(function(err){
        console.error(err);
        notify("pe-7s-close-circle","No se pudo conectar a la base de datos. Favor de revisar que el servidor se encuentre encendido.",'danger');
      })
    }

    //function that creates the pdf
    function showPdf(manifiesto){
      var generador = manifiesto.generador;
      var residuos = manifiesto.residuos;
      var transportista = manifiesto.transportista;
      var transporte = manifiesto.transporte;
      var chofer = manifiesto.chofer;
      var ruta = manifiesto.ruta;
      var destinatario = manifiesto.destinatario;
      var responsable = manifiesto.responsable;
      var writeStream = Fs.createWriteStream(global.views + "manifest/manifiesto.pdf");
      var doc = new PDFDocument();

      writeStream.on('finish', function () {
        nw.Window.open(global.hviews + "manifest/manifiesto.pdf",function(window){
          window.maximize();
        });
      });

      doc.pipe(writeStream);

      //Plantilla
      doc.image(global.views + 'manifest/plantilla-estado.jpg',0,0,{
        width:650,
      });

      doc.fontSize(9);

      //identificador del manifiesto
      //doc.text(manifiesto.identificador, 430, 113);

      //Datos del generador
    //  doc.text(generador.nra,45,140);
      doc.text(manifiesto.noManifiesto,430, 113);
    //  doc.text(manifiesto.pagina,525,140);
    var fullAddress = generador.domicilio + ", " + generador.codigoPostal + ", " + generador.municipio;
      doc.text(generador.razonSocial,155,134);
      doc.text(fullAddress,120,146);
    //  doc.text(generador.codigoPostal,400,171);
      // doc.text(generador.municipio,165,185);
      // doc.text(generador.estado,400,185);
      doc.text(generador.telefono,414,146);

      //residuos
      for(var i = 0; i < residuos.length; i++){
        doc.text(residuos[i].name,90,216 + (12*i));
        doc.text(residuos[i]._pivot_cantidadContenedor,230,216 + (12*i));
        doc.text(residuos[i]._pivot_tipoContenedor,385,216 + (12*i));
        var totalRes = residuos[i]._pivot_cantidadUnidad + " " + residuos[i]._pivot_unidad;
        doc.text(totalRes,310,216 + (12*i));
        doc.text(residuos[i]._pivot_destino,475,216 + (12*i));
      }

      doc.text(manifiesto.instruccionesEspeciales,90,305);
      doc.text(manifiesto.nombreResponsableGenerador,90,333);

      //empresa transportadora
      doc.text(transportista.nombre,165,377);
      if(transportista.domicilio.length > 65)
      doc.fontSize(7);
      doc.text(transportista.domicilio,125,389);
      doc.fontSize(9);
      doc.text(transportista.telefono,420,389);
      //doc.text(transportista.autorizacionSemarnat,192,450);
      doc.text(transportista.sct,225,412);
      doc.text(chofer.nombre,90,448);
      //doc.text(manifiesto.cargoTransportista,100,501);
      var date =(moment(manifiesto.fechaEmbarque).isValid())? moment(manifiesto.fechaEmbarque).format('D/MM/YYYY'):"";
      doc.text(date,155,425);
      if(ruta.nombre.length > 90)
      doc.fontSize(7);
      doc.text(ruta.nombre,90,475);
      doc.fontSize(9);
      doc.text(transporte.tipoTransporte,415,401);
      doc.text(transporte.placas,195,401);

      //Destinatario
      doc.text(destinatario.nombre,153,494);
      doc.text(destinatario.ine,225,517);
      if(destinatario.domicilio.length > 65)
      doc.fontSize(7);
      doc.text(destinatario.domicilio,125,505);
      doc.fontSize(9);
      doc.text(destinatario.telefono,420,505);
      //if(manifiesto.observaciones.length > 65)
      //doc.fontSize(7);
      //doc.text(manifiesto.observaciones,129,645);
      //doc.fontSize(9);
      doc.text(responsable.nombre,90,553);
      //doc.text(manifiesto.cargoDestinatario,100,693);
      date =(moment(manifiesto.fechaRecepcion).isValid())? moment(manifiesto.fechaRecepcion).format('D/MM/YYYY'):"";
      doc.text(date,155,530);
      doc.end();
    }

    //function to alter the manifests to show them in the table
    function getRows(){
      var manifiestos = new Manifiesto().fetchAll({withRelated:["user","generador","transportista","residuos","destinatario",'archivo']}).then(function(manifiestos){
        manifiestos = manifiestos.toJSON();
        var edited = [];
        _.forEachRight(manifiestos,function(manifiesto){
          var editedManifest = manifiesto;
          editedManifest.created_at = moment(manifiesto.created_at).format("D/MM/YYYY");
          editedManifest.updated_at = moment(manifiesto.updated_at).format("D/MM/YYYY");
          editedManifest.buttons = '<button type="button" class="btn btn-link btn-sm btn-simple btn-options" id="' + manifiesto.identificador + '">'+
            'Opciones'+
          '</button>';
          editedManifest.userfullname = manifiesto.user.name + " " + manifiesto.user.lastname;
          editedManifest.pdf = (manifiesto.archivo.id != undefined)? '<span class="label label-primary" style="font-size:100%">Adjuntado</span>' : '<span class="label label-danger" style="font-size:100%">Sin Adjuntar</span>';
          edited.push(editedManifest);
        })
        return edited;
      }).catch(function(err){
        console.error(err);
        notify("pe-7s-circle-close","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger")
      });
      return manifiestos
    }
}( window.searchManifest = window.searchManifest || {}, jQuery ));
