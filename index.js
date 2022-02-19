const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const Article = require('./models/article');
const database = require('./config/database');
const passport = require('passport');
const { ensureAuthentication } = require('./helpers');

mongoose.connect(database.connection);
const db = mongoose.connection;

db.once('open', function(){
    console.log('Connected');
})

db.on('error', function(e){
    console.log('Error occured');
    console.log(e);
})
const app = express();

app.use(flash());
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    secret: 'my secret',
    resave: true, 
    saveUninitialized: true
}))


app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
})

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport)

app.get('*', function(req, res, next){
    console.log(req.user);
    res.locals.user = req.user || null
    next();
})

app.get('/', ensureAuthentication, function(req, res){
    Article.find({}, function(err, list) {
        if(err){
            console.log(err);
            res.send(500);
        }
        res.render('index', {
            articles: list,
            title: 'Articles'
        });
    })
});

app.use('/articles', require('./routes/articles'))
app.use('/user', require('./routes/users'));

app.listen(3001, function(){
    console.log('listen on port 3000')
})