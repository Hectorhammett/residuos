var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
  if(req.isAuthenticated()){
    console.log(req.user);
    next();
  }
  else{
    console.log("Is not Authenticated");
    return res.redirect('/');
  }
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('index',{
    user:req.user
  });
});

router.get('/account',function(req, res, next){
  res.render('account.hjs',{
    user:req.user
  });
});

module.exports = router;
