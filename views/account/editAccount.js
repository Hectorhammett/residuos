function renderPage(){
  var Hogan = require('hjs');
  var Fs = require('fs');
  console.log(global.user.attributes);
  var data = {
    name: global.user.attributes.name,
    lastname: global.user.attributes.lastname,
    username: global.user.attributes.username,
    public: global.public,
    userLevel: (global.user.attributes.userLevel == 1)? "Administrador" : "Capturista",
    views: global.views
  };

  var html = Fs.readFileSync(global.views+"account/editAccount.hjs","utf8");
  var template = Hogan.compile(html);
  var page = template.render(data);
  return page;
}
