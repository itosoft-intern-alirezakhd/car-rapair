import express from "express"
//auth 
import  registerController from '../../../controllers/api/v1/userController/auth/registerController.js'
import loginController from '../../../controllers/api/v1/userController/auth/loginController.js'
import loginOTPController from '../../../controllers/api/v1/userController/auth/loginOTPController.js'

//car
import  createCarController from '../../../controllers/api/v1/userController/car/createController.js'
import  indexCarController from '../../../controllers/api/v1/userController/car/indexController.js'
import  singleCarController from '../../../controllers/api/v1/userController/car/singleController.js'
import  destroyCarController from '../../../controllers/api/v1/userController/car/destroyController.js'
import  updateCarController from '../../../controllers/api/v1/userController/car/updateController.js'
//import middleware
import grantAccess from '../../middlewares/share/grant-access-middleware.js'
import { TYPE_PERMISSION } from "../../../helpers/const.js";
import { TYPE_RESOURCE } from "../../../helpers/const.js";
import isLoggedIn from '../../middlewares/share/isLogged-middleware.js'

//validation 
import createCarValidation from '../../../validation/share/car-validation.js'

//Router
const router = express.Router();

//auth 
const authRouter = express.Router();
authRouter.post('/signup', registerController.signUp.bind(registerController) );
authRouter.post('/login', loginController.login.bind(loginController));
authRouter.post('/loginWithOTP', loginOTPController.loginWithOTP.bind(loginOTPController));
router.use('/auth' , authRouter)

//Car
const carRouter = express.Router();
carRouter.post('/create' , createCarValidation , createCarController.createCar.bind(createCarController))
carRouter.post('/getAll', indexCarController.index.bind(indexCarController))
carRouter.get('/getCar/:carId', singleCarController.single.bind(singleCarController))
carRouter.put('/update/:carId' , updateCarController.updateCar.bind(updateCarController))
carRouter.delete('/delete/:carId',destroyCarController.deleteCar.bind(destroyCarController))
router.use('/cars' , isLoggedIn(["user"])  , carRouter);

export default router