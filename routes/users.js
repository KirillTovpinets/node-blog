const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/user');

router.get('/register', function(req, res) {
    res.render('register');
})

router.post('/register', function(req, res) {
    bcrypt.genSalt(10, function(err, salt){
        bcrypt.hash(req.body.password, salt, function(err, hash){
            if(err){
                console.log(err);
                return;
            }
            const user = new User({
                ...req.body,
                password: hash
            });
            user.save(function(err){
                if(err){
                    console.log(err);
                    return;
                }
                res.redirect('/user/login')
            });
        })
    })
})

router.get('/login', function(req, res){
  res.render('login');
})

router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true,
  })(req, res, next);
})

router.get('/logout', function(req, res, next){
  req.logout();
  req.flash('success', 'You have been successfully logged out');
  res.redirect('/user/login');
})

module.exports = router;