var nw = require('nw.gui');
var win = nw.Window.get();
var path = require('path');
var nwPath = process.execPath;
var nwDir = path.dirname(nwPath);

global.public = nwDir+"/public/";
global.views = nwDir+"/views/";
global.models = nwDir+"/models/";
global.views = nwDir+'/views/';

win.on('loaded',function(){
  this.maximize();
})
