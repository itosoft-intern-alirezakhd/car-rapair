import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();
import express from 'express'
import mongoose from 'mongoose'
import routes from './routes/route.js'
const app = express();
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
const swaggerDocument = require('./swagger.json');

//import middleware 
import checkAuth from './modules/routes/middlewares/check-auth-middleware'
import allowCrossDomain from './modules/routes/middlewares/set-header-middleware'
import errorMiddleware from "./modules/routes/middlewares/error-middleware.js";

mongoose.connect(`mongodb://localhost/salamatKhodro`, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to Database"));

app.use(allowCrossDomain);
app.use('/api/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(checkAuth);
app.use('/api', routes);
app.use(errorMiddleware);

const Port = 5000;
app.listen(Port, () => console.log('Server Started', Port));