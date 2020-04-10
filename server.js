"use strict";
const express=require('express');
require('./models/db');
const expbs=require('express-handlebars');
const app=express();
const mongoose=require('mongoose');
const path=require('path');
const parse=require('body-parser');
const route1=require('./api/userController');

//Middleware
const urlencodedParser = parse.urlencoded({ extended: true });

app.use(urlencodedParser)
app.use(parse.json())


app.engine('handlebars',expbs({
    defaultLayout:'main',
    layoutsDir:path.join(__dirname,'views/layouts')
}));

var port = process.env.port || 3000;
app.set('view engine','handlebars');
app.use(express.static('public'));
app.use('/',express.static(__dirname+'/public'));
app.use('/',route1);
app.listen(port,()=>{
    console.log('Express server started at port '+port)
});
// const usey=mongoose.model('User',userSchema);
// let all= usey.find();
// console.log(all);