$(document).ready(function(){
  getPage("index-page.html");
})

//handlers ----------------------------------------------------------------------------

$("#main-menu li a").click(function(e){
  var link = this;
  e.preventDefault();
  e.stopImmediatePropagation();
  $('.active-menu').removeClass('active-menu');
  $(link).addClass('active-menu');
  getPage($(link).prop('href'));
})

//functions----------------------------------------------------------------------------
function getPage(url){
  $.get(url,function(response){
    pastePage(response);
  })
  .fail(function(xhr,textStatus,errorThrown){
    alert("Hubo un error en la aplicación: " + textStatus);
  })
  .success(function(){
    // console.log($('#inner-script').attr('src'));
    // $.getScript($('#inner-script').attr('src'));
  });
}

function pastePage(data){
  $('#page-inner').html(data);
}
