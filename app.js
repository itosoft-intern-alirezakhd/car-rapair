// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
require("dotenv").config();
const express = require('express');
const routes = require('./modules/routes/api/public/api-v1');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const config = require('./config')
const {DATABASE_URL} = require('./modules/helpers/const')

const app = express();
const swaggerDocument = require('./swagger.json');
const middleware  = config.path.middleware 

//import middleware 
const checkAuth = require(`${middleware}/check-auth-middleware`)
const allowCrossDomain = require(`${middleware}/set-header-middleware`)
const errorMiddleware = require(`${middleware}/error-middleware`)

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