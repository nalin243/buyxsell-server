const mongoose = require('mongoose')
const {Schema,model} = mongoose


const ItemSchema = new Schema({
	name:{type:String,required:true},
	price:{type:Number,required:true},
	description: String, 
	sellername: String
})

const BuyerUserSchema = new Schema({
	username: {type:String,required:true},
	name:{type:String,required:true},
	password: {type:String,required:true,minLength:[8,'Must be atleast of length 8']},
	email: {type:String,required:true},
	Cart:[ItemSchema]

})

module.exports = model('BuyerUser',BuyerUserSchema)