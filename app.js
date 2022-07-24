import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import swaggerUi from 'swagger-ui-express'
// const {DATABASE_URL} = require('./modules/helpers/const')
import {DATABASE_URL} from './modules/helpers/const.js'
import {config} from './config.js'
import routes from "./modules/routes/api/public/api-v1.js"
const app = express();
const swaggerDocument = require('./swagger.json');
const middleware  = config.path.middleware 
//import middleware 
import checkAuthMiddleware from "./modules/routes/middlewares/check-auth-middleware.js";
import allowCrossDomain from "./modules/routes/middlewares/set-header-middleware.js";
import errorMiddleware from "./modules/routes/middlewares/error-middleware.js";

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
app.use(checkAuthMiddleware);
app.use('/api', routes);
app.use(errorMiddleware);

const Port = 5000;
app.listen(Port, () => console.log('Server Started', Port));