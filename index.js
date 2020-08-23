require('dotenv').config()
// console.log(process.env.SESSION_SECRECT)
var express = require('express')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
// var csurf = require('csurf');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true,useUnifiedTopology: true });


var userRouter = require('./routes/user.route')
var wordRouter =  require('./routes/words.route')
var loginRouter = require('./routes/login.route')
var logoutRouter = require('./routes/logout.route')
var productRouter = require('./routes/product.route')
var cartRoute = require('./routes/cart.route');
var transferRoute = require('./routes/transfer.route');
var apiProductRoute = require('./api/routes/product.route');

var authMiddleware = require('./middlewares/auth.middleware.js')
var sessionMiddleware = require('./middlewares/session.middleware');

var app = express()
var port = process.env.PORT || 3000;
app.set('view engine','pug')
app.set('views','./views')

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser(process.env.SESSION_SECRECT))
app.use(sessionMiddleware);
// app.use(app.router);
// app.use(csurf({ cookie: true }));

app.use(express.static('public'))
 //router
app.use('/users',authMiddleware.requireAuth,userRouter)
app.use('/words',authMiddleware.requireAuth,wordRouter)
app.use('/login',loginRouter)
app.use('/logout',logoutRouter)

app.use('/products',authMiddleware.requireAuth,productRouter)
app.use('/cart', cartRoute);
app.use('/transfer', authMiddleware.requireAuth, transferRoute);
app.use('/api/products',apiProductRoute)

 app.get('/',authMiddleware.requireAuth,function(req,res){
  res.render('index',{
    name:'Quang'
  })
 })

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
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
