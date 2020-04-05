"use strict";
const express=require('express');
const router=express.Router();
router.use(express.static('/public'))
const mongoose=require('mongoose');
const parse=require('body-parser');
const User=require('../models/user.model');
const usey=mongoose.model('User');
const urlencodedParser = parse.urlencoded({ extended: true });


router.get('/thanks',(req,res)=>{
    res.render('thankYou',{title:'Thank You!',layout:null})
});

router.get('/profile',(req,res)=>{
    res.render('profile');
})
router.post('/signUp',urlencodedParser,(req,res)=>{
    User.findOne({userid:req.body.userid},(err,obj)=>{
        if(obj===null) {
            console.log("In If");
            addUser(req,res);
            //res.render('thankYou',{title:"Thank You!",name:req.body.name,layout:null});
        }
        else {
            console.log("In else");
            res.render('useless',{title:'LOL!',layout:null});
        };
    });
});

// User.find({}, function(err, users) {
//     var userMap = {};

//     users.forEach(function(user) {
//       userMap[user._id] = user;
//     });
//     console.log(userMap)  ;
//   });
router.post('/login',urlencodedParser,(req,res)=>{
    User.findOne({userid:req.body.userid},(err,obj)=>{
        if(!err){
            if(req.body.userid=='' | req.body.password==''){
                if(req.body.userid=='' & req.body.password=='')
                    res.render('home',{
                        uid:'This field is required',
                        ups:'This field is required'
                    })
                else{
                    if(req.body.userid=='') res.render('home',{uid:'This field is required'})
                    else if(req.body.password=='') res.render('home',{ups:'This field is required'})
                }
            }
            else if(obj==null){
                res.render('home',{
                    viewTitle:'User does not exist'
                })
            }
            else if(req.body.password!=obj.password || req.body.password==null){
                res.render('home',{
                    viewTitle:'Incorrect Password'
                })
            }
            else if(req.body.password==obj.password){
                res.render('profile',{
                    name:obj.name,
                    posts:(Object.keys(obj.posts).length)-1,
                    folr:(Object.keys(obj.followers).length)-1,
                    foli:(Object.keys(obj.following).length)-1,
                    id:obj._id
                })
            }
        }else console.log('Error in signing in')
    });
});

router.get('/post:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render('post',{
                id:req.params.id,
                name:doc.name
            })
        }
        else console.log(err)
    })
})

router.post('/post:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(!err){
            var dt=Date.now()
            doc.update(doc.posts.push({quote:req.body.quote,date:dt,like:0}),(err)=>{
                if(!err){
                    res.render('profile',{
                        name:doc.name,
                        posts:(Object.keys(doc.posts).length)-1,
                        folr:(Object.keys(doc.followers).length)-1,
                        foli:(Object.keys(doc.following).length)-1,
                        id:doc._id
                    })
                    User.findByIdAndUpdate(req.params.id,doc,(err)=>{
                        if(err) console.log('User not modified with new post')
                    })
                }
                else console.log('Post not added')
            })
        }
        else console.log('Error in adding post')
    })
})

router.get('/',(req,res)=>{
    res.render("home",{
        title:'Home'
    });
    var user=new User()
    console.log(user)
});

function addUser(req,res){
    var user=new User()
    user.name=req.body.name;
    user.userid=req.body.userid;
    user.password=req.body.password;
    user.save((err)=>{
        if(!err){
            res.render('thankYou',{
                title:"Thank You!",
                name:req.body.name,
                layout:null
            });
            console.log('Signup successful');
        }
        else{
            // if(err.name=='ValidationError'){
            //     handleValidationError(err,req.body);
            //     res.render("home",{user: req.body});
            // }
            // else 
            console.log('error in Signing up -> '+err);
        }
    });
};

function checkUser(req,res){
    User.findOne({userid:req.body.userid},(err,obj)=>{
        if(obj==null) {
            res.render('useless');
        }
        else {
            res.render('thankYou');
        }
    });
};

function handleValidationError(err,body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'name':
                body['nameError']=err.errors[field].message;
                break;
            case 'userid':
                body['useridError']=err.errors[field].message;
                break;
            case 'password':
                body['passwordError']=err.errors[field].message;
                break;
            default: break;
        }
    }
};


module.exports=router;
