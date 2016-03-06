(function( addManifest, $, undefined ) {
    //Private Property
    var Validator = require("validatorjs");
    var Generador = require(global.models)("Generador");
    var Residuo = require(global.models)("Residuo");
    var Transportista = require(global.models)("Transportista");
    var Destinatario = require(global.models)("Destinatario");
    var Manifiesto = require(global.models)("Manifiesto");
    var Knex = require(global.db).knex;
    var Meta = require(global.models)("Meta");
    var _ = require("lodash");
    var moment = require("moment");
    var residuos = [];
    var Fs = require('fs');
    var PDFDocument = require('pdfkit');

    addManifest.testForm = function(form){
      console.log(form);
    }
    addManifest.initializePage = function(){
      initForm();
      initDatepickers();

      addManifest.getNextIndex().then(function(index){
        document.getElementsByName("identificacion")[0].value = index;
      })

      addManifest.getTrashType().then(function(residuos){
        if(residuos.length == 1){
          alert("No existen tipos de residuos registrados en el sistema. Favor de solicitar al administrador del sistema de agregar los posibles tipos de residuo que se pueden utilizar dentro de los manifiestos.")
        }else{
          $('.residuo-tipo').select2({
            placeholder: "Tipo de Residuo",
            allowClear: true,
            data: residuos
          })
        }
      });

      addManifest.getCurrentManifest().then(function(data){
        $("input[name='noManifest']").val(data.value);
      })

      getGenerators().then(function(generadores){
        console.log(generadores);
        if(generadores.length == 1){
          alert("No existen Generadores de Residuos registrados en el sistema. Favor de solicitar al administrador del sistema de agregar los posibles Generadores de residuos que se pueden utilizar dentro de los manifiestos.")
        }
        else{
          $('#razon-social').select2({
            placeholder: "Razón Social de la Empresa",
            allowClear: true,
            data: generadores
          })
        }
      })

      getTransporters().then(function(transporters){
        console.log(transporters);
        if(transporters.length == 1){
          alert("No existen Transportistas de Residuos registrados en el sistema. Favor de solicitar al administrador del sistema de agregar los posibles Transportistas de residuos que se pueden utilizar dentro de los manifiestos.");
        }
        else{
          $('#nombreTransportista').select2({
            placeholder: "Nombre de la Empresa",
            allowClear: true,
            data: transporters
          })
        }
      });

      getDestinations().then(function(destinatarios){
        console.log(destinatarios);
        if(destinatarios.length == 1){
          alert("No existen Destinatarios de Residuos registrados en el sistema. Favor de solicitar al administrador del sistema de agregar los posibles Destinatarios de residuos que se pueden utilizar dentro de los manifiestos.");
        }
        else{
          $('#destinatario-nombre').select2({
            placeholder: "Nombre de la Empresa",
            allowClear: true,
            data: destinatarios
          })
        }
      })
    }

    //Function to add the handlers to the select2 in the Generador seccion
    $(document).on("select2:select","#razon-social",function(){
      var selected = this.value;
      new Generador({
        id: selected
      }).fetch().then(function(generador){
        generador = generador.toJSON();
        $("input[name='domicilio']").val(generador.domicilio);
        $("input[name='municipio']").val(generador.municipio);
        $("input[name='estado']").val(generador.estado);
        $("input[name='telefono']").val(generador.telefono);
        $("input[name='nra']").val(generador.nra);
      }).catch(function(err){
        console.error(err);
        notify("pe-7s-circle-close","Hubo un error en la base de datos. Favor de revisar que el servidor se encuentr encendido.");
      })
    })

    $(document).on("select2:unselect","#razon-social",function(){
      $("input[name='domicilio']").val("");
      $("input[name='municipio']").val("");
      $("input[name='estado']").val("");
      $("input[name='telefono']").val("");
      $("input[name='nra']").val("");
    });


    //function to add the handlers to the Residuos section in the form
    $(document).on("select2:select",".residuo-tipo",function(){
      console.log(this,$(this).val());
      var selected = this;
      new Residuo({
        id: selected.value
      }).fetch({withRelated:['unidad']}).then(function(residuo){
        var residuo = residuo.toJSON();
        console.log(residuo);
        $("input[name='residuoUnidad']",$(selected).closest("tr")).val(residuo.unidad[0].nombre);
      }).catch(function(err){
        console.error(err);
        notify("pe-7s-circle-close","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre funcionando.","danger");
      })
    })

      $(document).on("select2:unselect",".residuo-tipo",function(){
        $("input[name='residuoUnidad']",$(this).closest("tr")).val("");
      });

    //function to handle the selection on the transporters name
    $(document).on("select2:select","#nombreTransportista",function(){
      selected = this;
      console.log(this.value);
      new Transportista({
        id: selected.value
      }).fetch().then(function(transportista){
        transportista = transportista.toJSON();
        $("input[name='transportistaSct']").val(transportista.sct);
        $("input[name='transportistaTelefono']").val(transportista.telefono);
        $("input[name='transportistaDomicilio']").val(transportista.domicilio);
        $("input[name='transportistaAutorizacion']").val(transportista.autorizacionSemarnat);
      }).catch(function(err){
        console.error(err);
        notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido","danger")
      })
    })

      $(document).on("select2:unselect","#nombreTransportista",function(){
        $("input[name='transportistaSct']").val("");
        $("input[name='transportistaTelefono']").val("");
        $("input[name='transportistaDomicilio']").val("");
      })

    //function to handle for selection on the destination on the form
    $(document).on("select2:select","#destinatario-nombre",function(){
      var selection = this;
      new Destinatario({
        id: selection.value
      }).fetch().then(function(destinatario){
        var destinatario = destinatario.toJSON();
        $("input[name='destinatarioDomicilio']").val(destinatario.domicilio);
        $("input[name='destinatarioIne']").val(destinatario.ine);
        $("input[name='destinatarioTelefono']").val(destinatario.telefono);
      })
    });

    $(document).on("select2:unselect","#destinatario-nombre",function(){
      $("input[name='destinatarioDomicilio']").val("");
      $("input[name='destinatarioIne']").val("");
      $("input[name='destinatarioTelefono']").val("");
    })

    //function to initialize the Datepickers
    function initDatepickers(){
      $('.datepicker').datepicker({
        autoclose:true,
        todayBtn:true,
        format:"d/mm/yyyy"
      })
      .on('show', function(e) {
        console.log("Show");
        $(".datepicker-dropdown").css({
          visibility: "visible!important",
          opacity: "1!important"
        });
      })
      .on('hide',function(e){
        console.log("Hide");
        $(".datepicker-dropdown").css({
          visibility: "visible!important",
          opacity: "1!important"
        })
      });
    }
    //function to ghet the curren manifest nnumber
    addManifest.getCurrentManifest = function(){
      var current = new Meta({
        id:3
      }).fetch().then(function(current){
        current = current.toJSON();
        return current;
      }).catch(function(err){
        console.error(err);
        notify('pe-7s-circle-close',"Error comunicándose con la base de datos.","danger");
      })
      return current;
    }

    //Function to start the steps wizard
    function initForm(){
      $("#example-basic").steps({
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        autoFocus: true,
        labels: {
            cancel: "Cancelar",
            current: "Pazo Actual:",
            pagination: "Paginación",
            finish: "Guardar",
            next: "Siguiente",
            previous: "Anterior",
            loading: "Cargando ..."
        },
        onFinishing: function(event, currentIndex) {
          var form = $(this).serializeObject();
          var rules = {
            idDestinatario: "required"
          }
          var validation = new Validator(form,rules)

          if(validation.fails()){
            notify("pe-7s-close-circle","Es necesario seleccionar un destinatario.","danger");
            return false;
          }
          return true;
        },
        onStepChanging: function(event,currentIndex, newIndex){
          var form = $(this).serializeObject();
          if (currentIndex > newIndex)
           {
               return true;
           }
          if(currentIndex == 0){
            var rules = {
              noPage: "required|numeric",
              razonSocial: "required"
            }
            var validation = new Validator(form,rules);

            validation.setAttributeNames({
              noPage: "Página",
              razonSocial: "Razón Social de la Empresa"
            });

            if(validation.fails()){
              var errors = validation.errors.all();
              var string = "";
              for(x in errors){
                string += errors[x] + "<br/>";
              }
              notify("pe-7s-close-circle",string,"danger");
              return false;
            };
            return true;
          }
          if(currentIndex == 1){
            var completed = [];
            for(var i = 0; i < 4; i++){
              var object = {};
              object.tipo = form.tipo[i];
              object.cantidad = form.cantidad[i];
              object.contenedor = form.contenedor[i];
              object.residuoTotal = form.residuoTotal[i];
              object.residuoUnidad = form.residuoUnidad[i];

              var rules = {
                tipo: "required",
                cantidad: "required|numeric",
                contenedor: "required",
                residuoTotal: "required|numeric",
                residuoUnidad: "required"
              }

              var validation = new Validator(object,rules);

              validation.setAttributeNames({
                tipo: "Descripción",
                cantidad: "Cantidad",
                contenedor: "Tipo de Contenedor",
                residuoTotal: "Cantidad Total de Residuo",
                residuoUnidad: "Unidad VOL/PES"
              });

              if(validation.passes()){
                completed.push(object);
              }
            }

            if(completed.length == 0){
              notify("pe-7s-close-circle","Es necesario capturar al menos un tipo de residuo completo","danger");
              return false;
            }
            else{
              residuos = completed;
            }

            var rules = {
              nombreResponsable: "required|min:5",
            }

            var validation = new Validator(form,rules);

            validation.setAttributeNames({
              nombreResponsable: "Nombre del Responsable"
            })

            if(validation.fails()){
              var errors = validation.errors.all();
              var string = "";
              for(x in errors){
                string += errors[x] + "<br/>";
              }
              notify("pe-7s-close-circle",string,"danger");
              return false;
            }
            return true;
          }
          if(currentIndex == 2){
            var rules = {
              idTransportadora: "required"
            }

            var validation = new Validator(form,rules);

            if(validation.fails()){
              notify("pe-7s-close-circle","Es necesario seleccionar una empresa transportadora","danger");
              return false;
            }
            return true;
          }
        },
        onFinished: function(){
          var form = $(this).serializeObject();
          console.log(form);
          saveManifest(form);
          $("#capturar-manifiesto").click();
        },
        onInit:function (event, currentIndex, priorIndex) {
          adjustStepHeight();
        },
        onStepChanged:function (event, currentIndex, priorIndex) {
          adjustStepHeight();
        }
      });
    }

    //handler for resize the window
    $(window).on('resize',function(){
      adjustStepHeight();
    })

    //function to adjust the heigt for the form
    function adjustStepHeight(){
      sum = 0;
      //get the current step number
      stepNumber = $("#example-basic").steps("getCurrentIndex");

      //get the combined height of all child elements in the step
      $("#example-basic-p-"+stepNumber).children().each(function(){
           sum += ($(this).height()+
                         parseInt($(this).css("margin-top"))+
                         parseInt($(this).css("margin-bottom"))
      )});

      //add vertical padding to the sum variable
      sum += (parseInt($("#example-basic-p-"+stepNumber).css("padding-top")))*2;

      //set height of step to the sum value
      $(".wizard > .content").css("height",sum);
    }

    //function to store the manifest in the DB
    function saveManifest(form){
      if(form.transportistaFecha != ""){
        form.transportistaFecha = moment(form.transportistaFecha, "D/MM/YYYY").format('YYYY-MM-DD');
      }
      if(form.destinatarioRecepcion != ""){
        form.destinatarioRecepcion = moment(form.destinatarioRecepcion,"D/MM/YYYY").format('YYYY-MM-DD');
      }
      var attributes = {
        registroBC: form.noRegister,
        noManifiesto: form.noManifest,
        pagina: form.noPage,
        idGenerador: form.razonSocial,
        instruccionesEspeciales: form.instruccionesEspeciales,
        nombreResponsableGenerador: form.nombreResponsable,
        idTransportista: form.idTransportadora,
        nombreTransportista: form.transportistaNombre,
        cargoTransportista: form.transportistaCargo,
        fechaEmbarque: form.transportistaFecha,
        ruta: form.transportistaRuta,
        tipoVehiculo: form.transportistaVehiculo,
        placa: form.transportistaPlacas,
        idDestinatario: form.idDestinatario,
        observaciones: form.destinatarioObservaciones,
        nombreDestinatario: form.destinatarioNombre,
        cargoDestinatario: form.destinatarioCargo,
        fechaRecepcion: form.destinatarioRecepcion,
        created_by:global.user.attributes.id
      }

      new Manifiesto(attributes).save().then(function(manifiesto){
        var manifiesto = manifiesto.toJSON();
        console.log(manifiesto);
        var final = [];
        for(var i = 0; i < residuos.length; i++){
          var manipulated = {}
          manipulated.idManifiesto = manifiesto.identificador;
          manipulated.idResiduo = residuos[i].tipo;
          manipulated.cantidadContenedor = residuos[i].cantidad;
          manipulated.tipoContenedor = residuos[i].contenedor;
          manipulated.cantidadUnidad = residuos[i].residuoTotal;
          manipulated.unidad = residuos[i].residuoUnidad;
          final.push(manipulated);
        }
        console.log(final,manifiesto.identificador)
        Knex('manifiesto_has_residuos').insert(final).then(function(){
          notify("pe-7s-check","Se ha guardado el manifiesto correctamente","success");
          fetchNew(manifiesto.identificador);
          $("#capturar-manifiesto").click();
        }).catch(function(err){
          console.error(err);
          notify("pe-7s-close-circle","Hubo un error guardando los residuos","danger");
        });
      }).catch(function(err){
        notify("pe-7s-close-circle","Hubo un error guardando el manifiesto. Favor de revisar que el servidor se encuentre disponible","danger");
      });
    }

    //function to create the pdf with the manifest
    function createPDF(manifest){
      var writeStream = Fs.createWriteStream(global.views + "manifest/manifiesto.pdf");
      var doc = new PDFDocument();

      writeStream.on('finish', function () {
        nw.Window.open(global.views + "manifest/manifiesto.pdf",function(window){
          window.maximize();
        });
      });

      doc.pipe(writeStream);
      doc.image(global.views + 'manifest/plantilla.jpg',0,0,{
        width:615,
      });
      doc.end();
    }

    //Function to get the next local  manifest number
    addManifest.getNextIndex = function(){
      var index = Knex.raw("SELECT `AUTO_INCREMENT` as 'index' FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'residuos' AND TABLE_NAME = 'manifiesto'").then(function(data){
        return data[0][0].index;
      });
      return index;
    }

    //function to get all the trash types in the database
    addManifest.getTrashType = function(){
      var residuos = new Residuo().where('estado',1).fetchAll().then(function(residuos){
        console.log(residuos);
        return modifySelect2(residuos.toJSON(),"id","name");
      })
      .catch(function(err){
        console.error(err);
        $.notify({
          message:"Hubo en error conectándose a la base de datos. Favor de revisar que el servidor se encuentre funcionando",
          icon:"pe-7s-close-circle"
        },{
          type:"danger"
        });
      })
      return residuos;
    }

    function createPdf(manifiesto){
      var generador = manifiesto.generador;
      var residuos = manifiesto.residuos;
      var transportista = manifiesto.transportista;
      var destinatario = manifiesto.destinatario;
      var writeStream = Fs.createWriteStream(global.views + "manifest/manifiesto.pdf");
      var doc = new PDFDocument();

      writeStream.on('finish', function () {
        nw.Window.open(global.views + "manifest/manifiesto.pdf",function(window){
          window.maximize();
        });
      });

      doc.pipe(writeStream);

      //Plantilla
      doc.image(global.views + 'manifest/plantilla.jpg',0,0,{
        width:615,
      });

      //identificador del manifiesto
      doc.text(manifiesto.identificador, 30, 105);

      doc.fontSize(9);

      //Datos del generador
      doc.text(generador.nra,45,140);
      doc.text(manifiesto.noManifiesto,430,140);
      doc.text(manifiesto.pagina,525,140);
      doc.text(generador.razonSocial,255,157);
      doc.text(generador.domicilio,100,171);
      doc.text(generador.codigoPostal,400,171);
      doc.text(generador.municipio,165,185);
      doc.text(generador.estado,400,185);
      doc.text(generador.telefono,70,200);

      //residuos
      for(var i = 0; i < residuos.length; i++){
        doc.text(residuos[i].name,55,242 + (10*i));
        doc.text(residuos[i]._pivot_cantidadContenedor,320,242 + (10*i));
        doc.text(residuos[i]._pivot_tipoContenedor,380,242 + (10*i));
        doc.text(residuos[i]._pivot_cantidadUnidad,450,242 + (10*i));
        doc.text(residuos[i]._pivot_unidad,520,242 + (10*i),{
          width:300
        });
      }

      doc.text(manifiesto.instruccionesEspeciales,55,320);
      doc.text(manifiesto.nombreResponsableGenerador,205,400);

      //empresa transportadora
      doc.text(transportista.nombre,240,420);
      if(transportista.domicilio.length > 65)
      doc.fontSize(7);
      doc.text(transportista.domicilio,100,435);
      doc.fontSize(9);
      doc.text(transportista.telefono,445,435);
      doc.text(transportista.autorizacionSemarnat,192,450);
      doc.text(transportista.sct,515,450,{
        width:300
      });
      doc.text(manifiesto.nombreTransportista,100,488);
      doc.text(manifiesto.cargoTransportista,100,501);
      doc.text(moment(manifiesto.fechaEmbarque).format('D/MM/YYYY'),510,501,{
        width:300
      });
      if(manifiesto.ruta.length > 90)
      doc.fontSize(7);
      doc.text(manifiesto.ruta,50,540);
      doc.fontSize(9);
      doc.text(manifiesto.tipoVehiculo,152,559);
      doc.text(manifiesto.placa,442,559);

      //Destinatario
      doc.text(destinatario.nombre,235,582);
      doc.text(destinatario.ine,240,596);
      if(destinatario.domicilio.length > 65)
      doc.fontSize(7);
      doc.text(destinatario.domicilio,95,610);
      doc.fontSize(9);
      doc.text(destinatario.telefono,400,610);
      if(manifiesto.observaciones.length > 65)
      doc.fontSize(7);
      doc.text(manifiesto.observaciones,129,645);
      doc.fontSize(9);
      doc.text(manifiesto.nombreDestinatario,100,678);
      doc.text(manifiesto.cargoDestinatario,100,693);
      doc.text(moment(manifiesto.fechaRecepcion).format('D/MM/YYYY'),510,693,{
        width:300
      });
      doc.end();
    }

    //finction to fetch the recent manifest
    function fetchNew(newManifest){
      new Manifiesto({
        identificador: newManifest
      }).fetch({withRelated:['generador','transportista','residuos','destinatario']}).then(function(manifiesto){
        createPdf(manifiesto.toJSON());
      }).catch(function(err){
        alert(error);
        console.error(err);
      })
    }

    //function to get all the generators in the DB
    function getGenerators(){

      var generadores = new Generador().fetchAll().then(function(generadores){
        var generadores = generadores.toJSON();
        generadores = modifySelect2(generadores,"id","razonSocial");
        return generadores;
      }).catch(function(err){
        console.log(err);
        notify("pe-7s-circle-close","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger")
      })

      return generadores
    }

    //function to get all the transporters from the db
    function getTransporters(){
      var transporters = new Transportista().fetchAll().then(function(transporters){
        return modifySelect2(transporters.toJSON(),'id','nombre');
      }).catch(function(err){
        console.error(err);
        notify("pe-7s-circle-close","Hubo un error con la base de datos. Favor de revisar que se encuentr encendido.","danger");
      })

      return transporters;
    }

    //function to get all the desinations from the db
    function getDestinations(){
      var destinatarios = new Destinatario().fetchAll().then(function(destinatarios){
        return modifySelect2(destinatarios.toJSON(),'id','nombre');
      }).catch(function(err){
        console.error(err);
        notify("pe-7s-close-circle","Hubo un error con la base de datos. Favor de revisar que el servidor se encuentre encendido.","danger");
      })

      return destinatarios;
    }

    //Function to modify a collection to meet the requirements for the Select2 js
    function modifySelect2(data,id,text){
      var manipulated = new Array();
      manipulated.push({
        id: "",
        text: ""
      })
      _.forEachRight(data,function(object){
        manipulated.push({
          id: object[id],
          text: object[text]
        })
      })
      return manipulated;
    }

}( window.addManifest = window.addManifest || {}, jQuery ));
