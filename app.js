require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

const authRouteHandler = require('./routes/auth')
const jobRouteHandler = require('./routes/jobs')
const connectDB = require('./db/connect')
const authUser = require('./middleware/authentication')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, // 15 minutes
		max: 100, // limit each IP to 100 requests per windowMs
	})
)
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.use(express.json())
// extra packages

// routes
app.get('/', (req, res) => {
	res.send('jobs api')
})

app.use('/auth', authRouteHandler)
app.use('/jobs', authUser, jobRouteHandler)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 3000

const start = async () => {
	try {
		await connectDB(process.env.MONGO_URI)
		app.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		)
	} catch (error) {
		console.log(error)
	}
}

start()
