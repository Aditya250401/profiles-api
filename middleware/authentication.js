const jwt = require('jsonwebtoken')
const { unAuthenticatedError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')

const auth = async (req, res, next) => {
	//checl headers
	const authHeaders = req.headers.authorization

	if (!authHeaders || !authHeaders.startsWith('Bearer')) {
		throw new UnauthenticatedError('Invalid redentials')
	}
	const token = authHeaders.split(' ')[1]

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET)
		console.log(payload)
		//attach the user to job routes
		req.user = {
			userId: payload.userId,
			name: payload.name,
		}
		next()
	} catch (error) {
		console.log(error)
	}
}
module.exports = auth
