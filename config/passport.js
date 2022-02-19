const LocalStratagy = require('passport-local').Strategy;
const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
  passport.use(new LocalStratagy(function(username, password, done){
    let query = { username };
    User.findOne(query, function(err, res){
      if(err){
        console.log(err);
        return;
      }

      if(!res){
        return done(null, false, { message: 'User not found'})
      }

      bcrypt.compare(password, res.password, function(err, isMatch){
        if(err){
          console.log(err);
          return;
        }
        if(isMatch){
          return done(null, res);
        }
        return done(null, false, { message: 'Wrong password'})
      })
    })
  }));

  passport.serializeUser(function(user, done){
    done(null, user.id);
  })

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    })
  })
}