import express from "express"
//auth 
import  registerController from '../../../controllers/api/v1/basicController/auth/registerController.js'
import whoController from '../../../controllers/api/v1/shareController/whoController.js'
import loginController from '../../../controllers/api/v1/basicController/auth/loginController.js'
import verifyOtpController from "../../../controllers/api/v1/basicController/auth/verifyOtpController.js";
//profile
import readProfileController from "../../../controllers/api/v1/basicController/profile/readController.js";
import updateProfileController from "../../../controllers/api/v1/basicController/profile/updateController.js";
//car
import  carController from '../../../controllers/api/v1/basicController/car/carController.js'
//import middleware
import allowLoggedIn from '../../middlewares/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/grant-access-middleware.js'

import { TYPE_PERMISSION } from "../../../helpers/const.js";
import { TYPE_RESOURCE } from "../../../helpers/const.js";

//Router
const router = express.Router();

router.get('/whoAmI', allowLoggedIn, whoController.whoAmI.bind(whoController));

//auth 
const authRouter = express.Router();
authRouter.post('/signup', registerController.signUp.bind(registerController) );
authRouter.post('/login', loginController.login.bind(loginController));
authRouter.post('/loginWithOTP', loginController.loginWithOTP.bind(loginController));
authRouter.post('/verifyOTP', verifyOtpController.verifyOTP.bind(verifyOtpController));
router.use('/auth' , authRouter);

//profile 
const profileRouter = express.Router();
profileRouter.get('/', allowLoggedIn, grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.PROFILE), readProfileController.getProfile.bind(readProfileController));
profileRouter.put('/update', allowLoggedIn, grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.PROFILE), updateProfileController.updateProfile.bind(updateProfileController));
router.use('/profile' , profileRouter);

//Car
const carRouter = express.Router();
carRouter.post('/create', allowLoggedIn, carController.addCar.bind(carController))
carRouter.post('/getAll', allowLoggedIn, carController.getAll.bind(carController))
carRouter.put('/update', allowLoggedIn, carController.updateCar.bind(carController))
carRouter.delete('/delete', allowLoggedIn, carController.deleteCar.bind(carController))
router.use('/cars' , carRouter);

export default router