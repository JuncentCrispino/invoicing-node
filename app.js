// import/define application framework
const dotenv = require('dotenv')
dotenv.config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// // import Routes
const userRoutes = require('./routes/userRoutes')

// // Server Setup
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	return res.send(
		`<html>
			<head>
				<title>Welcome to Invoice backend</title>
			</head>
			<body>
				<h3>Congratulations! The Invoice backend website is working!</h3>
			</body>
		</html>`
	)
})
app.use("/users", userRoutes)

mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
	console.log("Connected Now to MongoDB Atlas")
})

app.listen(process.env.PORT || 8080, () => {
	console.log(`API is now online on port ${process.env.PORT || 8080}`)
})