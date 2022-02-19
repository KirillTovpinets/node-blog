const express = require('express');
const router = express.Router();
const Article = require('../models/article');
const User = require('../models/user');
const { ensureAuthentication } = require('../helpers');


router.get('/add', ensureAuthentication,  function(req, res){
    res.render('add_article', {
        title: 'Add article'
    })
})

router.post('/add', function(req, res) {
    const article = new Article({
      ...req.body,
      author: req.user._id
    });
    article.save(function(err){
        if(err){
            res.send(500);
            return;
        }
        req.flash('success', 'Article Added')
        res.redirect('/');
    })
})

router.get('/:id', ensureAuthentication, function(req, res){
  Article.findById(req.params.id, function(err, article) {
      if(err){
          console.log(err);
          res.send(500);
          return;
      }

      User.findById(article.author, function(e, user){
        if(e){
          console.log(e);
          return;
        }

        res.render('article', {
          article,
          author: user.name
        })
      })
  })
})

router.delete('/:id', function(req, res){
  Article.deleteOne(req.params.id);
  req.flash('success', 'Article has been deleted successfully');
})
module.exports = router