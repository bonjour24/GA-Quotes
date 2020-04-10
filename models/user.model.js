const mongoose=require('mongoose')
 
var userSchema= new mongoose.Schema({
    name:{type:String,required:'This field is required',uppercase:true},
    userid:{type:String,required:'This field is required'},
    password:{type:String,required:'This field is required'},
    followers:[mongoose.Schema.Types.ObjectId],
    following:[mongoose.Schema.Types.ObjectId],
    posts:[{
        quote:{type:String,default:'HIII QUOTED'},
        date:{type:Date,default:Date.now()},
        like:{type:Number,default:0}
    }]
},{
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
});

module.exports = mongoose.model('User',userSchema);