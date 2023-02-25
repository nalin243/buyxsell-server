const mongoose = require('mongoose')
const {Schema,model} = mongoose 

const ItemSchema = new Schema({
	name:{type:String,required:true},
	price:{type:Number,required:true},
	description: {type:String,maxLength: 240},
	sellername: {type:String,required:true},
	sold:{type:Boolean,default:false},
	soldto:{type:String}
})

module.exports = model('Item',ItemSchema)