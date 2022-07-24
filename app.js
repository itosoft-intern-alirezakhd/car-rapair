import { createRequire } from "module";
const require = createRequire(import.meta.url);



require("dotenv").config();

import express from 'express'
import mongoose from 'mongoose'
import routes from './routes/route.js'
// const express = require('express');
// const mongoose = require('mongoose');
const app = express();
// const routes = require('./routes/route');
// const bodyParser = require('body-parser');
import bodyParser from 'body-parser'
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken'
// const User = require('./models/userModel');
import User from './models/userModel.js'
// const swaggerUi = require("swagger-ui-express")
import swaggerUi from 'swagger-ui-express'
// import swaggerDocument from './swagger.json'
const swaggerDocument = require('./swagger.json');

mongoose.connect(`mongodb://localhost/salamatKhodro`, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to Database"));

var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type Authorization');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type,Authorization, Accept');
	next();
};
app.use(allowCrossDomain);

app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.use(express.json());
// app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: false}));
app.use(async (req, res, next) => {
	if (req.headers["authorization"]) {
		const re = new RegExp('Bearer (.*)');
		let accessToken = req.headers["authorization"].match(re)
		if (accessToken === null) return res.status(401).json({error: 'Please enter a valid format for token'})
		jwt.verify(accessToken[1], process.env.JWT_SECRET, async (err, decoded) => {
			if (err && err.message) return res.status(401).json({error: `${err.message}, please login to obtain a new one`});
			// const user = await User.findById(decoded.userId);
			// if (user.accessToken !== accessToken) return res.status(401).json({error: `jwt expired, please login to obtain a new one`});
			else res.locals.loggedInUser = await User.findById(decoded.userId);
			next();
		});
	} else {
		next();
	}
})
// app.use(express.static(__dirname + '/uploads'));

app.use('/api', routes);

const Port = 5000;
app.listen(Port, () => console.log('Server Started', Port));