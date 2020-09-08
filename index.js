// 'use strict'
require('dotenv').config()
// console.log(process.env.SESSION_SECRECT)
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true,useUnifiedTopology: true });
var db = require('./db')

var userRouter = require('./routes/user.route')
var loginRouter = require('./routes/login.route')
var logoutRouter = require('./routes/logout.route')

var arduinoRouter = require('./routes/arduino.route')
// var apiArduinoRoute = require('./api/routes/arduino.route');

var authMiddleware = require('./middlewares/auth.middleware.js')
var sessionMiddleware = require('./middlewares/session.middleware');
var setScheduleMiddleware = require('./middlewares/arduino.middleware')

var app = express()
var port = process.env.PORT || 3000;
app.set('view engine','pug')
app.set('views','./views')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRECT))
app.use(sessionMiddleware);


app.use(express.static('public'))
// app.use(express.static(__dirname+'/public'))
// app.use(express.static(__dirname + "/staticFiles")); 
 //router
app.use('/users',authMiddleware.requireAuth,userRouter)
app.use('/login',loginRouter)
app.use('/logout',logoutRouter)
app.use('/arduino/',setScheduleMiddleware.setSchedule,arduinoRouter)

 app.get('/',authMiddleware.requireAuth,function(req,res){
  var arduino=  db.get('arduino').value()
  res.render('index',{
    arduino:arduino
  })
 })

app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});

 //----------------------
 app.listen(port,function(){
  //console.log('open in port: '+port)
 })
