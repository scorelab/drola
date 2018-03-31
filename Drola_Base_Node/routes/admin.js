let express = require('express');
let router = express.Router();
let mongoose=require('mongoose');
let User = require('../models/user');
let Drone = require('../models/drone');


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
            res.redirect('/admin/manageUsers');
            console.log(err);
        }else{
            res.redirect('/admin/manageUsers');
        }
    })
});

router.get('/approveUser', function (req, res) {
    Drone.find({}, function (err, data) {
        if(err){
            console.log(err);
        }else{
            res.render('allRegistrations.ejs', {user: data});
        }
    });
});

router.get('/deleteDrone/:id', function (req, res) {
    Drone.remove({_id: req.params.id}, function (err, data) {
        if(err){
            res.redirect('/admin/approveUser');
            console.log(err);
        }else{
            res.redirect('/admin/approveUser');
        }
    })
});

router.post('/approveDrone/:id', function (req, res) {
   Drone.update({_id: req.params.id}, { $set: { verification_status: true } }, function (err, data) {
       if (err){
           console.log(err);
       }else{
           res.redirect('/admin/approveUser');
       }
   });
});

module.exports=router;