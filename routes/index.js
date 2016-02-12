var express = require('express');
var router = express.Router();
var moment = require('moment');
moment().locale('es');
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/models.js')("User");
var flash = require('express-flash');
/* GET home page. */

//Route to get the login page
router.get('/', function(req, res, next) {
  res.render('login', { systemName: 'Ecological' , date:moment().locale('es').format('LL')});
});

//Route to send the authentication to the server
router.post('/login',function(req, res, next){
  passport.authenticate('local',{failureRedirect:'/'},function(err,user,info){
    if(err)
      return res.render('login',{errorMessage:err.message});
    if(!user)
      return res.render('login',{errorMessage:info.message});
    return req.login(user,function(err){
      if(err)
        return res.render('login',{errorMessage:err.message});
      return res.redirect('/users/dashboard');
    });
  })(req, res, next);
});

//Route to get the signup page page
router.get('/signup', function(req, res, next) {
  res.render('testSign', { systemName: 'Ecological' , date:moment().locale('es').format('LL')});
});

router.post('/signup',function(req, res, next){
  var user = req.body;
  var userPromise = null;
  usernamePromise = new User({username:user.username}).fetch();
  usernamePromise.then(function(model){
    if(model){
      res.render('testSign',{errorMessage:"El usuario ya existe"});
    }
    else{
      var password = user.password;
      var hash = bcrypt.hashSync(password);

      var signedUpUser = new User({username:user.username,password:hash});

      signedUpUser.save().then(function(model){
        req.flash('successMessage',"Tu usuario ha sido creado correctamente, inicia sesión para ingresar al sistema");
        res.redirect('/');
      })
    }
  });
});

module.exports = router;
