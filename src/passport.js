const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const passport = require('passport')
const User = require('../models/UserSchema')

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.SECRETKEY
}

passport.use(new JwtStrategy(options,(jwtPayload,done)=>{
	User.findOne({username:jwtPayload.username})
		.then((user)=>{
			if(!user)
				done(null,false)
			else 
				done(null,user)
		})
}))