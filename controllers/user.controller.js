// module.exports = {
//   a=1,
//   b=2
// }
// module.exports.a = 1
// module.exports.b = 2

var shortid = require('shortid');
var db = require('../db')

module.exports.index = function(req,res){
  res.render('users/index',{
    users:db.get('users').value()
  })
 }

module.exports.search =  (req,res) => {
  console.log(req.query);
  var name_search = req.query.q 
  var users = db.get('users').value()
  var result = users.filter( (user) => {
    return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1
  })

  res.render('users/index', {
    users: result // render lại trang users/index với biến users bây giờ chỉ bao gồm các kết quả phù hợp
  });
}


module.exports.create = function(req,res){
  res.render('users/create')
}

module.exports.view_user = function(req,res){
  var id = req.params.id
  var user = db.get('users').find({id:id}).value()
  res.render('users/view',{
    user:user
  })
}

module.exports.delete = function(req,res){
    // Route parameters: thong so duong truyen
  var id = req.params.id
  var user = db.get('users').find({id:id}).value()
  var user = db.get('users').remove({id:id}).write()
  res.redirect('/users')
}

module.exports.postCreate = function(req,res){
    req.body.id = shortid.generate();
    var errors = [];

    if (!req.body.name) {
      errors.push('Name is required.');
    }

    if (!req.body.phone) {
      errors.push('Phone is required');
    }

    if (errors.length) {
      res.render('users/create', {
        errors: errors,
        values: req.body
      });
    return;
  }
    db.get('users').push(req.body).write()
    res.redirect('/users');
}