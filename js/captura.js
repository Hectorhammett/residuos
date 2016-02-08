var Bookshelf = require('./js/bookshelf');

console.log(Bookshelf);

var test = Bookshelf.Model.extend({
  tableName: 'test'
})

$(document).on('submit','#capture-form',function(event){
  event.preventDefault();
  event.stopImmediatePropagation();
  var form = $(this).form();
  console.log(form);
  insertModel(form);
});

function insertModel(form){
  new test({
    Nombre:form.nombre,
    Apellido:form.apellido,
    Materno:form.materno
  }).save();
}

$.fn.form = function() {
    var formData = {};
    this.find('[name]').each(function() {
        formData[this.name] = this.value;
    })
    return formData;
};
