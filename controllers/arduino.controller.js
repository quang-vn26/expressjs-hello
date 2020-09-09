var shortid = require('shortid');
var db = require('../db')

var lich = db.get('schedule').value()
var date_now = new Date().toDateString()

var arduino=  db.get('arduino').value()
module.exports.index = async function (req,res,next) {
  res.render('arduino/index',{
    arduino:arduino
  });
}

module.exports.status = function (req,res){
  res.render('arduino/status')
}
module.exports.trangthai = async function (req,res,next) {
  var t =db.get('arduino').value()
  var tmp=""
  t.map(function (x) {
    tmp+=x.id+x.status
  })
  res.send(tmp);
}


module.exports.lichsu = async function (req,res,next) {
  let history = db.get('arduino_history').value()
  res.render('arduino/lichsu',{
    arduino:history
  });
}


module.exports.xoalichsu = async function (req,res,next) {
  db.get('arduino_history').remove().write();
  res.redirect('/arduino/lichsu')
}

module.exports.datlich = function (req,res,next) {
  var arduino=  db.get('schedule').value()
  res.render('arduino/datlich',{
    arduino:arduino,date_now:date_now
  })
}

module.exports.deleteSchedule = async function (req,res,next) {
  db.get('schedule').remove().write();
  res.redirect('/arduino/datlich')
}
module.exports.deleteScheduleItem = async function (req,res,next) {
  var id = req.params.id
  console.log('id:'+id)
  db.get('schedule').remove({id:id}).write();
  // db.get('schedule').find({id:id}).value()
  res.redirect('/arduino/datlich')
}

module.exports.getAPI = async function(req, res) {
  var t =db.get('arduino').value()
 res.json(t);

};

///--------------
module.exports.chatbot = function (req,res,next){
}

// -----------------
module.exports.postSchedule = async function (req,res,next) {
  req.body.date = date_now
  req.body.id = shortid.generate();
  db.get('schedule').unshift(req.body).write()
  var t =db.get('schedule').value()
  res.redirect('/arduino/datlich')
}

module.exports.postAPI = async function (req,res,next) {
  req.body.date = new Date()
  if(req.body.status == 'Bật') req.body.status = '_bat'
  else req.body.status = '_tat'
  db.get('arduino')
  .find({ id: req.body.id })
  .assign({ status:req.body.status})
  .write()
  db.get('arduino_history').unshift(req.body).write() 
  res.redirect('/')

}


