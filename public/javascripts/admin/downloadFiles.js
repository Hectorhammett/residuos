(function( downloadFiles, $, undefined ) {
    //Private Property
    var Archivo = require(global.models)("Archivo");
    var Validator = require("validatorjs");
    Validator.useLang('es');
    var _ = require('lodash');
    var knex = require(global.db).knex;

    downloadFiles.downloadFiles = function(form){
      var total = getTotalFiles();
      total.then(function(data){
        console.log(data);
      }).catch(function(err){
        console.log(err);
      })
    }

    function getTotalFiles(){
      var total = knex.raw("SELECT id,COUNT(*) AS total FROM pdf").then(function(data){
        return data[0][0].total;
      })
      return total;
    }


}( window.downloadFiles = window.downloadFiles || {}, jQuery ));
