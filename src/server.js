require('dotenv').config()

const PORT=process.env.PORT 
const HOST=process.env.HOST 

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const express = require('express')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const passport = require('passport')
const cors = require('cors')

const SellerUser = require('../models/SellerUserSchema')
const BuyerUser = require('../models/BuyerUserSchema')
const Item = require('../models/ItemSchema')


mongoose.connect(process.env.DB_URL)

const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(passport.initialize())

require('./passport')

app.post('/register',(req,res)=>{
	if(req.body.userType === "Seller"){
		SellerUser.findOne({username:req.body.username})
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

					const user = new SellerUser()

					user.username = req.body.username
					user.name = req.body.name
					user.password = hash
					user.email = req.body.email

					const error = user.validateSync()
						if(!error){
							user.save()
								res.status(200).send({
									success:true,
									message:"New seller user registered"
							})
						}
						else {
							if(error.errors?.username!=undefined){
								res.status(400).send({
									success:false,
									message:error.errors.username.message
								})
							}
							else if(error.errors?.name!=undefined){
								res.status(400).send({
									success:false,
									message:error.errors.name.message
								})
							}
							else if(error.errors?.email!=undefined){
								res.status(400).send({
									success:false,
									message:error.errors.username.message
								})
							}
							else if(error.errors?.password!=undefined){
								res.status(400).send({
									success:false,
									message:error.errors.username.message
								})
							}
						}
				})
			}
		})
	}
	else if(req.body.userType === "Buyer"){
		BuyerUser.findOne({username:req.body.username})
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

						const user = new BuyerUser()

						user.username = req.body.username
						user.name = req.body.name
						user.password = hash
						user.email = req.body.email

						const error = user.validateSync()
						if(!error){
							user.save()
								res.status(200).send({
									success:true,
									message:"New buyer user registered"
							})
						}
						else {
							if(error.errors?.username!=undefined){
								res.status(400).send({
									success:false,
									message:error.errors.username.message
								})
							}
							else if(error.errors?.name!=undefined){
								res.status(400).send({
									success:false,
									message:error.errors.name.message
								})
							}
							else if(error.errors?.email!=undefined){
								res.status(400).send({
									success:false,
									message:error.errors.username.message
								})
							}
							else if(error.errors?.password!=undefined){
								res.status(400).send({
									success:false,
									message:error.errors.username.message
								})
							}
						}
				
				})
			}
		})
	}
})

app.post("/login",(req,res)=>{
	if(req.body.userType === "Buyer"){
		BuyerUser.findOne({username:req.body.username})
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
								id: user._id,
							}

							const token = jwt.sign(payload,process.env.SECRETKEY,{expiresIn:'1h'})
							res.status(200).send({
								success:true,
								message:"Logged in!",
								user: user.username,
								userType: "Buyer",
								token: "Bearer "+token
							})
						}
					})
				}
			})
	}
	else if(req.body.userType === "Seller") {
		SellerUser.findOne({username:req.body.username})
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
								id: user._id,
							}

							const token = jwt.sign(payload,process.env.SECRETKEY,{expiresIn:'1h'})
							res.status(200).send({
								success:true,
								message:"Logged in!",
								user: user.username,
								userType: "Seller",
								token: "Bearer "+token
							})
						}
					})
				}
			})
	}
})

app.get("/authcheck",passport.authenticate('jwt',{session:false}),(req,res)=>{
	console.log("Checking authentication...")
	res.status(200).send({
		success:true,
		message:"User already logged in!",
		user:req.user.username,
		userType:req.user.userType
	})
})

app.put("/updateshop",passport.authenticate('jwt',{session:false}),(req,res)=>{
	console.log("Updating shop...")

	const item = new Item()

	item.name = req.body.name 
	item.price =  req.body.price 
	item.description = req.body.description
	item.sellername = req.body.sellername

	const error = item.validateSync()
	if(!error){
		item.save()
		res.status(200).send({
			sucess:true,
			message:"Item added to shop!"
		})
	}
	else{
		if(error.errors?.name!=undefined){
			res.status(400).send({
				success:false,
				message:error.errors.name.properties.message
			})
		}
		else if(error.errors?.price!=undefined){
			res.status(400).send({
				success:false,
				message:error.errors.price.properties.message
			})
		}
		else if(error.errors?.sellername!=undefined){
			res.status(400).send({
				success:false,
				message:error.errors.sellername.properties.message
			})
		}
	}
})

app.listen(PORT,HOST,()=>{
	console.log(`Server started on ${HOST} on port ${PORT}`)
})