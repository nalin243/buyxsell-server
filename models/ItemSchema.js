const mongoose = require('mongoose')
const {Schema,model} = mongoose 

const ItemSchema = new Schema({
	name:{type:String,required:true},
	price:{type:Number,required:true},
	description: String, 
	sellername: {type:String,required:true}
})

module.exports = model('Item',ItemSchema)