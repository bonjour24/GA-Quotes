const mongoose=require('mongoose')
 
var userSchema= new mongoose.Schema({
    name:{type:String,required:'This field is required'},
    userid:{type:String,required:'This field is required'},
    password:{type:String,required:'This field is required'},
    followers:[mongoose.Schema.Types.ObjectId],
    following:[mongoose.Schema.Types.ObjectId],
    posts:[{
        quote:{type:String},
        date:{type:Date},
        like:{type:Number}
    }]
});

module.exports = mongoose.model('User',userSchema);