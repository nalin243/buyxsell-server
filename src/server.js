require('dotenv').config()

const PORT=process.env.PORT 
const HOST=process.env.HOST 

const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')

const User = require('../models/UserSchema')
mongoose.connect(process.env.DB_URL)

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.post('/register',(req,res)=>{
	bcrypt.hash(req.body.password,10,(err,hash)=>{
		if(err)
			console.log(err)

		const user = new User({
			username: req.body.username,
			password: hash 
		})
		user.save()
	})

	res.status(200).send({
		success:true,
		message:"New user registered"
	})
})


app.listen(PORT,HOST,()=>{
	console.log(`Server started on ${HOST} on port ${PORT}`)
})