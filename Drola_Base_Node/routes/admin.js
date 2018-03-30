let express = require('express');
let router = express.Router();
let mongoose=require('mongoose');
let User = require('../models/user');

router.get('/manageUsers', function (req, res) {
        User.find({}, function (err, data) {
            if(err){
                console.log(err);
            }else{
                res.render('manageUsers.ejs', {data: data});
            }
        });
});

router.get('/userDetails/:id', function (req, res) {
    let id=req.params.id;
    console.log(id);
    res.send('All user details along with the information of the drone owned by him/her will be displayed here.')
});

router.get('/delete/:id', function (req, res) {
    User.remove({_id: req.params.id}, function (err, data) {
        if(err){
            res.redirect('/manageUsers');
            console.log(data);
        }else{
            res.redirect('/admin/manageUsers');
        }
    })
});

module.exports=router;