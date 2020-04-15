const mongoose=require('mongoose')
 
var userSchema= new mongoose.Schema({
    name:{type:String,required:'This field is required',uppercase:true},
    userid:{type:String,required:'This field is required',lowercase:true},
    password:{type:String,required:'This field is required'},
    followers:[mongoose.Schema.Types.ObjectId],
    following:[mongoose.Schema.Types.ObjectId],
    posts:[{
        quote:{type:String,default:'**GAQ**'},
        date:{type:Date,default:Date.now()},
        like:[mongoose.Schema.Types.ObjectId]
    }]
},{
    writeConcern: {
      w: 'majority',
      j: true,
      wtimeout: 1000
    }
});

userSchema.index({'name':'text'})

module.exports = mongoose.model('User',userSchema);