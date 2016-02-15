function renderPage(){
  var moment = require('moment');
  var Hogan = require('hjs');
  var Fs = require('fs');
  moment.locale('es');
  console.log(global.user.attributes);
  var data = {
    name: global.user.attributes.name,
    lastname: global.user.attributes.lastname,
    username: global.user.attributes.username,
    public: global.public,
    lastchange: moment(global.user.attributes.updated_at.toISOString()).format("LL"),
    userLevel: (global.user.attributes.userLevel == 1)? "Administrador" : "Capturista",
    views: global.views
  };

  var html = Fs.readFileSync(global.views+"account/account.hjs","utf8");
  var template = Hogan.compile(html);
  var page = template.render(data);
  return page;
}
