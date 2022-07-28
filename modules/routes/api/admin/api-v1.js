import express from 'express';
//auth
import registerController from '../../../controllers/api/v1/adminController/auth/registerController.js'
import loginController from '../../../controllers/api/v1/adminController/auth/loginController.js'
import verifyOtpController from "../../../controllers/api/v1/adminController/auth/verifyOtpController.js";


const router = express.Router();

//auth 
const authRouter = express.Router();
authRouter.post('/signup', registerController.signUp.bind(registerController) );
authRouter.post('/login', loginController.login.bind(loginController));
authRouter.post('/loginWithOTP', loginController.loginWithOTP.bind(loginController));
authRouter.post('/verifyOTP', verifyOtpController.verifyOTP.bind(verifyOtpController));
router.use('/auth' , authRouter);



export default router