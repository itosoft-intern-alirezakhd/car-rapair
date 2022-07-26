import isSuperAdminMiddleware from "../../middlewares/is-superAdmin-middleware.js";
import express from 'express';
//auth
import  registerController from '../../../controllers/api/v1/superAdminController/auth/registerController.js'
import loginController from '../../../controllers/api/v1/superAdminController/auth/loginController.js'
import verifyOtpController from "../../../controllers/api/v1/superAdminController/auth/verifyOtpController.js";
//user
import createController from "../../../controllers/api/v1/superAdminController/user/createController.js";
import readController from "../../../controllers/api/v1/superAdminController/user/readController.js";
import destroyController from "../../../controllers/api/v1/superAdminController/user/destroyController.js";
import updateController from "../../../controllers/api/v1/superAdminController/user/updateController.js";
//role
import roleController from '../../../controllers/api/v1/superAdminController/role/roleController.js'
//middleware
import allowLoggedIn from '../../middlewares/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/grant-access-middleware.js'
//const 
import { TYPE_PERMISSION } from "../../../helpers/const.js";
import { TYPE_RESOURCE } from "../../../helpers/const.js";
const router = express.Router();

//auth 
const authRouter = express.Router();
authRouter.post('/signup', registerController.signUp.bind(registerController) );
authRouter.post('/login', loginController.login.bind(loginController));
authRouter.post('/loginWithOTP', loginController.loginWithOTP.bind(loginController));
authRouter.post('/verifyOTP', verifyOtpController.verifyOTP.bind(verifyOtpController));
router.use('/auth' , authRouter);

//User
const userRouter = express.Router();
userRouter.post('/create',grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.USER), createController.createUser.bind(createController));
userRouter.post('/getAll',grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), readController.getUsers.bind(readController));
userRouter.get('/getUser/:userId',grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), readController.getUser.bind(readController));
userRouter.put('/update',grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.USER), updateController.updateUser.bind(updateController));
userRouter.delete('/delete',grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.USER), destroyController.deleteUser.bind(destroyController));
router.use('/users' ,allowLoggedIn, isSuperAdminMiddleware , userRouter);

//Role
const roleRouter = express.Router();
roleRouter.post('/create', grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.ROLE), roleController.addRole.bind(roleController));
roleRouter.post('/getAll', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), roleController.getRoles.bind(roleController));
roleRouter.put('/update',  grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.ROLE), roleController.updateRole.bind(roleController));
roleRouter.delete('/delete', grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.ROLE), roleController.deleteRole.bind(roleController));
roleRouter.get('/distinct', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), roleController.distinct.bind(roleController));
router.use('/roles',allowLoggedIn , isSuperAdminMiddleware , roleRouter);


export default router
