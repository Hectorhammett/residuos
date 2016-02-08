var nw = require('nw.gui');
var win = nw.Window.get();

win.on('minimize',function(){
  console.log("Is minimized");
});
