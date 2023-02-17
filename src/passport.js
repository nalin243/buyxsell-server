const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const passport = require('passport')

const SellerUser = require('../models/SellerUserSchema')
const BuyerUser = require('../models/BuyerUserSchema')

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRETKEY
}

passport.use(new JwtStrategy(options,(jwtPayload,done)=>{
		SellerUser.findOne({username:jwtPayload.username})
		.then((user)=>{
			if(!user)
				done(null,false)
			else {
				user['userType'] = "Seller"
				done(null,user)
			}
		})
		.catch((err)=>{
		BuyerUser.findOne({username:jwtPayload.username})
		.then((user)=>{
			if(!user)
				done(null,false)
			else {
				user['userType'] = "Buyer"
 				done(null,user)
			}
		})
		})
		
}))