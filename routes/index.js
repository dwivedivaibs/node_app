var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectId;
var assert = require('assert');
var logout = require('express-passport-logout');
var passportLinkedIn = require('../auth/linkdin');
var passportTwitter = require('../auth/twitter');
var passportFacebook = require('../auth/facebook');

// var url = 'mongodb://localhost:27017/test';

 var url =  process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/test';


/* GET home page. */
router.get('/', function(req, res, next) {
  var $sess_user = req.session.user;
  if (!req.session.user) {
    res.render('index');
  }else{
    res.render('profile', { title: 'Logged In' , user: req.session.user.name});
  }
});

router.get('/profile', function(req, res) {
  var $sess_user = req.session.user;
  if (!req.session.user) {
    res.render('index');
  }else{
    res.render('profile', { title: 'Logged In' , user: req.session.user.name});
  }
});

router.get('/login', function(req, res, next) {
  res.send('Go back and register!');
});

// linkedin routes 
router.get('/auth/linkedin', passportLinkedIn.authenticate('linkedin'));

router.get('/auth/linkedin/callback',
  passportLinkedIn.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = req.user;
    // Successful authentication
    // res.json(req.user);
    res.render('profile', {user: req.user.name})
  });

// twitter routes 

router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = req.user;
    var $sess_user = req.session.user;
    res.render('profile', {user: req.user.name})
  });

// facebook routes

router.get('/auth/facebook', passportFacebook.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    req.session.user = req.user;
    var $sess_user = req.session.user;
     res.render('profile', {user: req.user.name})
  });


router.get('/user/logout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/');  
});

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated())
//     return next();
//   res.redirect('/');
// }


router.get('/get-data', function(req, res, next){
  mongo.connect(url, function(err, db){
    var resultArray = [];
    assert.equal(null, err);
    var cursor = db.collection('post').find();
    cursor.forEach(function(data, err){
      assert.equal(null, err);
      resultArray.push(data);
    }, function(){
      db.close();
      res.render('profile', {user: req.session.user.name, items: resultArray})
    })
  })
})

router.post('/insert', function(req ,res, next){
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('post').insertOne(item, function(err, result){
      assert.equal(null, err);
      db.close();
    })
  })
  res.redirect('/');
})

router.post('/update', function(req ,res, next){
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };

  var id = req.body.id;

  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('post').updateOne({"_id": objectId(id)}, {$set: item }, function(err, result){
      assert.equal(null, err);
      db.close();
    })
  })
  res.redirect('/');
})

router.post('/delete', function(req ,res, next){
  var id = req.body.id;
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('post').deleteOne({"_id": objectId(id)}, function(err, result){
      assert.equal(null, err);
      db.close();
    })
  })
  res.redirect('/');
})


router.get('/show-data', function(req ,res, next){
  var id = req._parsedUrl.query;
  mongo.connect(url, function(err, db){
    assert.equal(null, err);
    db.collection('post').findOne({"_id": objectId(id)}, function(err, result) {
      db.close();
      res.render('show', {user: req.session.user.name, items: result})
    });
  })
})


module.exports = router;
