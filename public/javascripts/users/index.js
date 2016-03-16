var Fs = require('fs');
var Hogan = require('hjs');
$(document).ready(function(){

})

//handlers----------------------------------------------------------------------

$(document).on('click','a',function(e){
  if($(this).attr('href') != "#" && $(this).attr('href') != global.hviews + "logout.html"){
    e.preventDefault();
    e.stopImmediatePropagation();
    if($(this).parent('li').parent('ul').hasClass('nav')){
      $('.active').removeClass('active');
      $(this).parent('li').addClass('active');
    }
    getUrl($(this).attr('href'));
  }
})

//functions---------------------------------------------------------------------
function getUrl(url){
  var html = Fs.readFileSync(global.views + url,'utf8');
  var extension = url.split('.')[1];
  if(extension != "html"){
    win.eval(null,html);
    printInPage(renderPage());
  }
  else{
    $("#page-holder").load(global.hviews + url);
  }
}

function printInPage(data){
  $('#page-holder').html(data);
}
