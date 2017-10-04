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
  res.render('index', { title: 'Cool How are you? ' });
});

router.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile.hbs', {
    user : req.user // get the user out of session and pass to template
  });
});

router.get('/login', function(req, res, next) {
  res.send('Go back and register!');
});

// linkedin routes 
router.get('/auth/linkedin', passportLinkedIn.authenticate('linkedin'));

router.get('/auth/linkedin/callback',
  passportLinkedIn.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    // res.json(req.user);
    res.render('profile', {items: req.user.name})
  });

// twitter routes 

router.get('/auth/twitter', passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    // res.json(req.user);
    // res.redirect('/');
     res.render('profile', {items: req.user.name})
  });

// facebook routes

router.get('/auth/facebook', passportFacebook.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    // res.json(req.user);
    // res.redirect('/');
     res.render('profile', {items: req.user.name})
  });


router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}


router.get('/get-data', function(req, res, next){
  mongo.connect(url, function(err, db){
    var resultArray = [];
    assert.equal(null, err);
    var cursor = db.collection('user').find();
    cursor.forEach(function(data, err){
      assert.equal(null, err);
      resultArray.push(data);
    }, function(){
      db.close();
      res.render('index', {items: resultArray})
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
    db.collection('user').insertOne(item, function(err, result){
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
    db.collection('user').updateOne({"_id": objectId(id)}, {$set: item }, function(err, result){
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
    db.collection('user').deleteOne({"_id": objectId(id)}, function(err, result){
      assert.equal(null, err);
      db.close();
    })
  })
  res.redirect('/');
})

module.exports = router;
