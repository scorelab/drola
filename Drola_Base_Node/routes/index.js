let express = require('express');
let router = express.Router();
let path=require('path');
let bodyParser = require('body-parser');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.get("/",function(req,res){
    //checkAndredirect(req,res);
    res.sendFile(path.join(__dirname,'../web/index.html'));
});

router.get('/adminPortal', function (req, res) {
    res.sendFile(path.join(__dirname,'../web/adminPortal.html'));
});

// Managing user login System...........................................................................................

router.use(require('express-session')({
    secret: "Keyboard cat",
    resave: true,
    saveUninitialized: true
}));

//Initialize passport
router.use(passport.initialize());
router.use(passport.session());

let finduser= function(username,callback){
    User.findOne({username:username},callback);
};

passport.use('local', new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user){
            if(err) throw err;
            if(!user){
                return done(err, false, {message: 'Unknown User'});
            }

            User.comparePassword(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Invalid password'});
                }
            });
        });
    })
);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});

// Register User
router.post('/register', function(req, res){
    let name = req.body.name;
    let email = req.body.email;
    let username = req.body.username;
    let password = req.body.password;

    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if(errors){
        res.render('register',{
            errors: errors
        });
    } else {
        let newUser = new User({
            name: name,
            email:email,
            username: username,
            password: password
        });

        User.createUser(newUser, function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');
        res.redirect('/login');
    }
});

router.post('/login',
    passport.authenticate('local', {
        failureRedirect:'/login',
        flashMessage: false
    }), function(req, res) {
        User.getUserByUsername(req.body.username, function (err, data) {
            if(err){
                console.log(err);
            }else{
                res.redirect(`/dashboard/${data._id}`);
            }
        });
    });

router.get('/logout', function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error_msg','You are not logged in');
        res.redirect('/login');
    }
}

//...........................................Other routes related to the user...........................................

// Register
router.get('/register', function(req, res){
    res.render('register.ejs');
});

// Login
router.get('/login', function(req, res){
    res.render('login.ejs');
});

router.get('/dashboard/:id', ensureAuthenticated, function(req, res){
    User.findOne({_id:req.params.id}, function (err, data) {
        if(err){
            console.log(err);
        }else{
            res.render('dashboard.ejs', {data: data});
        }
    })
});

router.get('/drone_register', function (req, res) {
   res.send('Drone database model is ready. Drone registration shall start soon.')
});

module.exports=router;