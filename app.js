import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import {DATABASE_URL} from './modules/helpers/const.js'
const app = express();
const swaggerDocument = require('./swagger.json');
//import router
import userApiV1Router from "./modules/routes/api/user/api-v1.js"
import adminApiRouter from './modules/routes/api/admin/api-v1.js'
import shareApiRouter from './modules/routes/api/share/api-v1.js'
//import middleware 
// import checkAuthMiddleware from "./modules/routes/middlewares/share/check-auth-middleware.js";
import allowCrossDomain from "./modules/routes/middlewares/share/set-header-middleware.js";
import errorMiddleware from "./modules/routes/middlewares/share/error-middleware.js";
import Car from "./modules/models/car-model.js";

mongoose.connect(DATABASE_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to Database"));

app.post('/g' , async(req , res , next)=> {
	console.log("JJJJ");
	const car = new Car({
		name: "samand",
		logo: "ir",
		model: "90",
		type: "saloon",
		brand: "iranKhodro",
		tip: "SX"
	  })
	await car.save();
	next()
})
app.use(allowCrossDomain);
app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));

// app.use(checkAuthMiddleware);

app.use("/api/v1/user", userApiV1Router);
app.use("/api/v1/admin", adminApiRouter);
app.use("/api/v1", shareApiRouter);

app.use(errorMiddleware);

const Port = 5000;
app.listen(Port,() =>{
	
 console.log('Server Started', Port)
});