require('dotenv').config()

const PORT=process.env.PORT 
const HOST=process.env.HOST 

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const passport = require('passport')

const User = require('../models/UserSchema')
mongoose.connect(process.env.DB_URL)

const app = express()
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(passport.initialize())

require('./passport')

app.post('/register',(req,res)=>{
	User.findOne({username:req.body.username})
		.then((user)=>{
			if(user){
				res.status(200).send({
					success:false,
					message:"User already exists!"
				})
			}
			else{
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
			}
		})
})

app.post("/login",(req,res)=>{
	User.findOne({username:req.body.username})
		.then((user)=>{
			if(!user){
				res.status(400).send({
					success:false,
					message:"User not found"
				})
			}
			else {
				bcrypt.compare(req.body.password,user.password,(err,result)=>{
					if(!result){
						res.status(400).send({
							success:false,
							message:"Incorrect password!"
						})
					}
					else {

						const payload = {
							username: user.username,
							id: user._id
						}

						const token = jwt.sign(payload,process.env.SECRETKEY,{expiresIn:'1d'})
						res.status(200).send({
							sucess:true,
							message:"Logged in!",
							token: "Bearer "+token
						})
					}
				})
			}
		})
})

app.listen(PORT,HOST,()=>{
	console.log(`Server started on ${HOST} on port ${PORT}`)
})