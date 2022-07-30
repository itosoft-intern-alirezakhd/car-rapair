import express from "express"
//auth 
import  registerController from '../../../controllers/api/v1/basicController/auth/registerController.js'
import loginController from '../../../controllers/api/v1/basicController/auth/loginController.js'
//car
import  createCarController from '../../../controllers/api/v1/basicController/car/createController.js'
import  readCarController from '../../../controllers/api/v1/basicController/car/readController.js'
import  destroyCarController from '../../../controllers/api/v1/basicController/car/destroyController.js'
import  updateCarController from '../../../controllers/api/v1/basicController/car/updateController.js'
//import middleware
import allowLoggedIn from '../../middlewares/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/grant-access-middleware.js'
import checkExistCar from '../../middlewares/check-exist-car-middleware.js'
import { TYPE_PERMISSION } from "../../../helpers/const.js";
import { TYPE_RESOURCE } from "../../../helpers/const.js";

//Router
const router = express.Router();

//auth 
const authRouter = express.Router();
authRouter.post('/signup', registerController.signUp.bind(registerController) );
authRouter.post('/login', loginController.login.bind(loginController));
authRouter.post('/loginWithOTP', loginController.loginWithOTP.bind(loginController));
router.use('/auth' , authRouter);

//Car
const carRouter = express.Router();
carRouter.post('/create',checkExistCar("create"),createCarController.createCar.bind(createCarController))
carRouter.post('/getAll', readCarController.getAll.bind(readCarController))
carRouter.get('/getCar/:carId', readCarController.getCar.bind(readCarController))
carRouter.put('/update', checkExistCar("update") , updateCarController.updateCar.bind(updateCarController))
carRouter.delete('/delete',destroyCarController.deleteCar.bind(destroyCarController))
router.use('/cars' , allowLoggedIn , carRouter);

export default router