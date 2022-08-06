import express from 'express';
//auth
import verifyOtpController from "../../../controllers/api/v1/shareController/auth/verifyOtpController.js";

//who
import whoController from '../../../controllers/api/v1/shareController/whoController.js';
//profile 
import singleProfileController from '../../../controllers/api/v1/shareController/profile/singleController.js';
import updateProfileController from '../../../controllers/api/v1/shareController/profile/updateController.js';

//Token 
import indexTokenController from '../../../controllers/api/v1/shareController/token/indexController.js'
import singleTokenController from '../../../controllers/api/v1/shareController/token/singleController.js'
import logoutTokenController from '../../../controllers/api/v1/shareController/token/logoutController.js'

//middleware
// import allowLoggedIn from '../../middlewares/share/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/share/grant-access-middleware.js'
import isLoggedIn from '../../middlewares/share/isLogged-middleware.js'
import who from '../../middlewares/share/who-middleware.js'
//const 
import { TYPE_PERMISSION } from "../../../helpers/const.js";
import { TYPE_RESOURCE } from "../../../helpers/const.js";
import checkRoleMiddleware from '../../middlewares/share/check-role-middleware.js';
//validation 
import verifyOTPValidation from '../../../validation/share/verifyOTP-validation.js'

const router = express.Router();

//auth
const authRouter = express.Router();
authRouter.post('/verifyOTP', verifyOTPValidation , verifyOtpController.verifyOTP.bind(verifyOtpController));
router.use('/auth' , authRouter);

//who
router.get('/whoAmI', who );

//profile
const profileRouter = express.Router();
profileRouter.get('/', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.PROFILE), singleProfileController.single.bind(singleProfileController));
profileRouter.put('/update', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.PROFILE), updateProfileController.updateProfile.bind(updateProfileController));
router.use('/profile' , isLoggedIn(["superAdmin" , "admin" , "user"])  , profileRouter);


//Token 
const tokenRouter = express.Router();
tokenRouter.get('/getAll'  ,   indexTokenController.index.bind(indexTokenController));
tokenRouter.get('/getToken/:tokenId'  ,  singleTokenController.single.bind(singleTokenController));
tokenRouter.post('/logout'  ,  logoutTokenController.logout.bind(logoutTokenController));
router.use('/tokens' ,isLoggedIn(["superAdmin" , "admin" , "user"])  , tokenRouter);



export default router