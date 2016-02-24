
//function for when you try to send a form, it should never NEVER reload anything.
$(document).on('submit','form',function(e){
  e.preventDefault();
  e.stopImmediatePropagation();
  var form = $(this).serializeObject();
  var namespace = $(this).attr('data-namespace');
  var func = $(this).attr('data-function');
  window[namespace][func](form);
});

$.fn.serializeObject = function(){
    var obj = {};

    $.each( this.serializeArray(), function(i,o){
        var n = o.name,
        v = o.value;

        obj[n] = obj[n] === undefined ? v
            : $.isArray( obj[n] ) ? obj[n].concat( v )
            : [ obj[n], v ];
    });

    return obj;
};

function notify(icon,text,type){
  $.notify({
    icon: icon,
    message: text
  },{
    type: type
  });
}
