const express=require('express')
require('./models/db')

const app=express()

app.listen(3000,()=>{
    console.log('Express server started at port 3000')
})