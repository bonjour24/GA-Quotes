const mongoose=require('mongoose')
 
var userSchema= new mongoose.Schema({
    name:{type:String,required:'This field is required'},
    userid:{type:String,required:'This field is required'},
    password:{type:String,required:'This field is required'},
    followers:[mongoose.Schema.Types.ObjectId],
    following:[mongoose.Schema.Types.ObjectId],
    posts:[postSchema]
});

var postSchema= new mongoose.Schema({
    quote:{type:String},
    date:{type:Date},
    like:{type:Number}
});

exports.User=mongoose.model('User',userSchema);