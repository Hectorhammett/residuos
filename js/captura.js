var Bookshelf = require('./js/bookshelf');

//Bookshelf Models ----------------------------------------------------
var Report = Bookshelf.Model.extend({
  tableName: 'test'
})

//Event Handlers ---------------------------------------------------------------
$(document).on('submit','#capture-form',function(event){
  event.preventDefault();
  event.stopImmediatePropagation();
  var form = $(this).form();
  console.log(form);
  insertModel(form);
});

//functions---------------------------------------------------------------------
/*
  Function to insert a new model
*/
function insertModel(form){
  // new test({
  //   Nombre:form.nombre,
  //   Apellido:form.apellido,
  //   Materno:form.materno
  // }).save();
}

$.fn.form = function() {
    var formData = {};
    this.find('[name]').each(function() {
        formData[this.name] = this.value;
    })
    return formData;
};
