const mongoose=require('mongoose')
require('dotenv/config')

mongoose.set('useFindAndModify', false);

mongoose.connect(process.env.DB_CONNECTION,{useNewUrlParser:true}, (err)=>{
    if(!err) console.log('MongoDB connected succesfully')
    else console.log(err)
})

require('./user.model');
