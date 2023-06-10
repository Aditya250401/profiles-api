const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
	const user = await User.create({ ...req.body })
	const token = user.JWTcreate()

	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}
const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new BadRequestError('please provide email and password')
	}
	const user = await User.findOne({ email })

	if (!user) {
		console.log(user)
		throw new UnauthenticatedError('the user is not found')
	}
	const isPasswordCorrect = await user.comparePassword(password)
	if (!isPasswordCorrect) {
		console.log(user)
		throw new UnauthenticatedError('galat hai password')
	}
	const token = user.JWTcreate()

	res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = {
	register,
	login,
}
