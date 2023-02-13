const mongoose = require('mongoose')
const {Schema,Model} = mongoose

const UserSchema = new Schema({
	username: String,
	password: String
})

module.exports = model('User',UserSchema)