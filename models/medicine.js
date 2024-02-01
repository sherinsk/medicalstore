var mongoose=require('mongoose')

schema=new mongoose.Schema({name:String,category:String})

module.exports=mongoose.model('medicine',schema)