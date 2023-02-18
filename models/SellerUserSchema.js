const mongoose = require("mongoose")
const {Schema,model} = mongoose 

const ItemSchema = new Schema({
	name:{type:String,required:true},
	price:{type:Number,required:true},
	description:String, 
	sold:{type:Boolean,default:false}
})

const SellerUserSchema = new Schema({
	username: {type:String,required:true},
	name:{type:String,required:true},
	password: {type:String,required:true,minLength:[8,'Must be at least of length 8']},
	email: {type:String,required:true},
	Items:{ItemSchema}
})


module.exports = model('SellerUser',SellerUserSchema)