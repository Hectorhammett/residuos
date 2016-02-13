$(document).ready(function(){

})

//handlers----------------------------------------------------------------------

$('a').click(function(e){
  if($(this).attr('href') != "#" && $(this).attr('href') != "/logout"){
    e.preventDefault();
    e.stopImmediatePropagation();
    $('.active').removeClass('active');
    $(this).parent('li').addClass('active');
    getUrl($(this).attr('href'));
  }
})

//functions---------------------------------------------------------------------
function getUrl(url){
  $.get(url,function(data){
    printInPage(data);
  });
}

function printInPage(data){
  $('#page-holder').html(data);
}
