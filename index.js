var express = require('express')
var app = express()
var port = 3000;
app.set('view engine','pug')
app.set('views','./views')

 // app.get('/',function(req,res){
 //  res.send('Hello coderx')
 // })
 app.get('/',function(req,res){
  res.render('index',{
    name: 'QQQ'
  })
 })

// Iteration

 app.get('/users',function(req,res){
  res.render('users/index',{
    users:[
    {id:1,name:'Quang'},
    {id:2,name:'Quang2'},
    {id:3,name:'Quang3'}
    ]
  })
 })
 app.listen(port,function(){
  console.log('open in port: '+port)
 })