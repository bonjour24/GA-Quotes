"use strict";
const express=require('express');
const router=express.Router();
router.use(express.static('/public'))
const mongoose=require('mongoose');
const parse=require('body-parser');
const User=require('../models/user.model');
const usey=mongoose.model('User');
const window=require('window')
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
                User.find({_id:obj.followers},'name',(err,folo)=>{
                    if(!err){
                        User.find({_id:obj.following},'name',(err,foli)=>{
                            res.render('profile',{
                                user:obj,
                                uid:obj._id,
                                folo:folo,
                                foli:foli
                            })
                        })
                    }
                })
            }
        }else console.log('Error in signing in')
    });
});

router.get('/profile:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(!err){
            User.find({_id:doc.followers},'name',(err,folo)=>{
                if(!err){
                    User.find({_id:doc.following},'name',(err,foli)=>{
                        res.render('profile',{
                            user:doc,
                            uid:doc._id,
                            folo:folo,
                            foli:foli
                        })
                    })
                }
            })
        }
    })
})

router.get('/search:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(req.query.name!=''){
            User.find({name:{$regex:req.query.name}},{__v:0 },(err,data)=>{
                if(!err){
                    var s;
                    if(data.length==0) s=1; else s=0;
                    User.find({_id:doc.followers},'name',(err,folo)=>{
                        if(!err){
                            User.find({_id:doc.following},'name',(err,foli)=>{
                                res.render('profile',{
                                    user:doc,
                                    uid:doc._id,
                                    folo:folo,
                                    foli:foli,
                                    se:s,
                                    sear:data
                                })
                            })
                        }
                    })
                }else console.log('No such name '+err)
            })
        }
        else{
            User.find({_id:doc.followers},'name',(err,folo)=>{
                if(!err){
                    User.find({_id:doc.following},'name',(err,foli)=>{
                        res.render('profile',{
                            user:doc,
                            uid:doc._id,
                            folo:folo,
                            foli:foli,
                            se:1
                        })
                    })
                }
            })
        }
    })
})

router.get('/sprofile:id/:_id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(!err){
            User.findOne({_id:req.params.id, followers: mongoose.Types.ObjectId(req.params._id)},(err,dec)=>{
                if(!err){
                    if(dec){
                        res.render('sprofile',{
                            sear:doc,
                            uid:req.params._id,
                            fol:true
                        })
                    }
                    else{
                        res.render('sprofile',{
                            sear:doc,
                            uid:req.params._id,
                            fol:false
                        })
                    }
                }
                else console.log('Doc not found : '+err)
            })
        }
    })
})

router.get('/close:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(!err){
            User.find({_id:doc.followers},'name',(err,folo)=>{
                if(!err){
                    User.find({_id:doc.following},'name',(err,foli)=>{
                        res.render('profile',{
                            user:doc,
                            uid:doc._id,
                            folo:folo,
                            foli:foli,
                        })
                    })
                }
            })
        }
    })
})

router.get('/follow:id/:_id',(req,res)=>{
    User.findById(req.params.id,(err,udoc)=>{
        if(!err){
            User.findById(req.params._id,(err,doc)=>{
                if(!err){
                    User.findOne({_id:doc._id,followers:mongoose.Types.ObjectId(udoc._id)},(err,dec)=>{
                        if(dec==null){
                            doc.update(doc.followers.push(udoc._id))
                            udoc.update(udoc.following.push(doc._id))
                            User.findByIdAndUpdate(req.params.id,udoc,(err)=>{
                                if(!err){
                                    User.findByIdAndUpdate(req.params._id,doc,(err)=>{
                                        if(!err) 
                                            res.render('sprofile',{
                                                sear:doc,
                                                uid:udoc._id,
                                                fol:true
                                            })
                                        else console.log('Follower not updated')
                                    })
                                }else console.log('User not updated')
                            })
                        }
                        else{
                            res.render('sprofile',{
                                sear:doc,
                                uid:udoc._id,
                                fol:true,
                                mes:'Already following'
                            })
                        }
                    })
                }else console.log('Follower not found')
            })
        }else console.log('User not found')
    })
})

router.get('/unfollow:id/:_id',(req,res)=>{
    User.findById(req.params.id,(err,udoc)=>{
        if(!err){
            User.findById(req.params._id,(err,doc)=>{
                if(!err){
                    User.findOne({_id:udoc._id, following: mongoose.Types.ObjectId(doc._id)},(err,dec)=>{
                        if(dec){
                            doc.update(doc.followers.pull(udoc._id))
                            udoc.update(udoc.following.pull(doc._id))
                            User.findByIdAndUpdate(req.params.id,udoc,(err)=>{
                                if(!err){
                                    User.findByIdAndUpdate(req.params._id,doc,(err)=>{
                                        if(!err){
                                            res.render('sprofile',{
                                                sear:doc,
                                                uid:udoc._id,
                                                fol:false
                                            })
                                        }
                                        else console.log('Unfollower not updated')
                                    })
                                }else console.log('User not updated')
                            })
                        }
                        else{
                            res.render('sprofile',{
                                sear:doc,
                                uid:udoc._id,
                                fol:false,
                                mes:'Not following'
                            })}
                    })
                }else console.log('Unfollower not found')
            })
        }else console.log('User not found')
    })
})

router.get('/like:id/:uid',(req,res)=>{
    User.findOne({"posts._id":req.params.id},null,(err,doc)=>{
        if(!err){
            User.findById(req.params.uid,(err,udoc)=>{
                if(!err){
                    User.find({"posts.like":udoc._id},(err,dec)=>{
                        if(!err){
                            if(dec==null | dec.length==0){
                                var size=doc.posts.length
                                for(var i=0;i<size;i++){
                                    if(doc.posts[i]._id==req.params.id)
                                        doc.posts[i].like.push(udoc._id);
                                }
                                User.findOneAndUpdate({"posts._id":req.params.id},doc,(err)=>{
                                    if(!err){
                                        console.log('Post liked')
                                        res.redirect('back')
                                    }
                                })
                            }else res.redirect('back')
                        }
                    })
                }
            })
        }
    })
})

router.get('/post:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(!err){
            res.render('post',{
                id:req.params.id,
                name:doc.name,
                butt:1  //Post
            })
        }
        else console.log(err)
    })
})

router.get('/edit:id',(req,res)=>{
    User.findOne({"posts._id":req.params.id}, null,(err, doc)=>{
        if(!err){
            var size=doc.posts.length
            for(var i=0;i<size;i++){
                if(doc.posts[i]._id==req.params.id){
                    var post=doc.posts[i].quote
                }
            }
            res.render('post',{
                id:doc._id,
                name:doc.name,
                qt:post,
                pid:req.params.id,
                butt:0 //Save edits
            })
        }
        else console.log(err)
    });
})

router.post('/edit:id/:_id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        //doc.updateOne({"posts.id":req.params._id},{$set:{"posts.$.quote":req.body.quote}},(err,result)=>{
        doc.update(doc.posts.pull({_id:req.params._id}),(err)=>{
            if(err) console.log('Error in pulling '+err)
        })
        doc.update(doc.posts.push({quote:req.body.quote,date:Date.now(),like:0}),(err)=>{
            if(!err){
                User.findByIdAndUpdate(req.params.id,doc,(err)=>{
                    if(!err){
                        User.find({_id:doc.followers},'name',(err,folo)=>{
                            if(!err){
                                User.find({_id:doc.following},'name',(err,foli)=>{
                                    res.render('profile',{
                                        user:doc,
                                        uid:doc._id,
                                        folo:folo,
                                        foli:foli,
                                    })
                                })
                            }
                        })
                    }
                    else console.log('User not modified with edited post')
                })
            }
            else console.log('Post not edited'+err)            
        })
    })
})

router.get('/delete:id',(req,res)=>{
    User.findOne({"posts._id":req.params.id},null,(err,doc)=>{
        if(!err){
            var id=doc._id
            doc.update(doc.posts.pull({_id:req.params.id}),(err)=>{
                if(!err){
                    User.find({_id:doc.followers},'name',(err,folo)=>{
                        if(!err){
                            User.find({_id:doc.following},'name',(err,foli)=>{
                                res.render('profile',{
                                    user:doc,
                                    uid:doc._id,
                                    folo:folo,
                                    foli:foli,
                                })
                            })
                        }
                    })
                    User.findByIdAndUpdate(id,doc,(err)=>{
                        if(err) console.log('User not updated')
                    })
                }
                else console.log('Error in deleting post '+err)
            })
        }
        else console.log('User not found')
    })
})

router.post('/post:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(!err){
            var dt=Date.now()
            doc.update(doc.posts.push({quote:req.body.quote,date:dt,like:0}),(err)=>{
                if(!err){
                    User.find({_id:doc.followers},'name',(err,folo)=>{
                        if(!err){
                            User.find({_id:doc.following},'name',(err,foli)=>{
                                res.render('profile',{
                                    user:doc,
                                    uid:doc._id,
                                    folo:folo,
                                    foli:foli,
                                })
                            })
                        }
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

router.get('/feed:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(!err){
            User.find({_id:doc.following},'posts userid').sort({'posts.date':-1}).exec((err,dec)=>{
            // User.find({_id:doc.following},'posts userid',(err,dec)=>{
                if(!err){
                    res.render('feed',{
                        user:doc,
                        uid:doc._id,
                        fposts:dec
                    })
                }
            })
        }
    })
})

router.get('/sear:id',(req,res)=>{
    User.findById(req.params.id,(err,doc)=>{
        if(req.query.name!=''){
            User.find({name:{$regex:req.query.name}},{__v:0 },(err,data)=>{
                if(!err){
                    var s;
                    if(data.length==0) s=1; else s=0;
                    res.render('feed',{
                        user:doc,
                        uid:doc._id,
                        sear:data,
                        se:s
                    })
                }else console.log('No such name '+err)
            })
        }
        else{
            res.render('search',{
                user:doc,
                uid:doc._id,
                se:1
            })      
        }
    })
})

router.get('/',(req,res)=>{
    res.render("home",{
        title:'Home'
    });
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