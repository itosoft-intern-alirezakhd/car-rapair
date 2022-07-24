import { createRequire } from "module";
import express from 'express'
import mongoose from 'mongoose'
import routes from './routes/route.js'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
import config from './config';
import {DATABASE_URL} from './modules/helpers/const'
const require = createRequire(import.meta.url);
require("dotenv").config();
const app = express();
const swaggerDocument = require('./swagger.json');
const middleware  = config.path.middleware 

//import middleware 
import checkAuth from `${middleware}/check-auth-middleware`
import allowCrossDomain from `${middleware}/set-header-middleware`
import errorMiddleware from `${middleware}/error-middleware.js`;

mongoose.connect(DATABASE_URL, {
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