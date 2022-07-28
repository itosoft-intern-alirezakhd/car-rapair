import express from 'express';
//auth
import registerController from '../../../controllers/api/v1/superAdminController/auth/registerController.js'
import loginController from '../../../controllers/api/v1/superAdminController/auth/loginController.js'
import verifyOtpController from "../../../controllers/api/v1/shareController/auth/verifyOtpController.js";
//user
import createUserController from "../../../controllers/api/v1/shareController/user/createController.js";
import readUserController from "../../../controllers/api/v1/shareController/user/readController.js";
import destroyUserController from "../../../controllers/api/v1/shareController/user/destroyController.js";
import updateUserController from "../../../controllers/api/v1/shareController/user/updateController.js";
//role
import readRoleController from '../../../controllers/api/v1/shareController/role/readController.js'
import destroyRoleController from '../../../controllers/api/v1/shareController/role/destroyController.js'
import distinctRoleController from '../../../controllers/api/v1/shareController/role/distinctController.js'
//who
import whoController from '../../../controllers/api/v1/shareController/whoController.js';
//profile 
import readProfileController from '../../../controllers/api/v1/shareController/profile/readController.js';
import updateProfileController from '../../../controllers/api/v1/shareController/profile/updateController.js';
//middleware
import allowLoggedIn from '../../middlewares/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/grant-access-middleware.js'
//const 
import { TYPE_PERMISSION } from "../../../helpers/const.js";
import { TYPE_RESOURCE } from "../../../helpers/const.js";
import checkRoleMiddleware from '../../middlewares/check-role-middleware.js';
const router = express.Router();

router.get('/whoAmI', allowLoggedIn, whoController.whoAmI.bind(whoController));

//profile
const profileRouter = express.Router();
profileRouter.get('/', allowLoggedIn, grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.PROFILE), readProfileController.getProfile.bind(readProfileController));
profileRouter.put('/update', allowLoggedIn, grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.PROFILE), updateProfileController.updateProfile.bind(updateProfileController));
router.use('/profile' , profileRouter);

authRouter.post('/verifyOTP', verifyOtpController.verifyOTP.bind(verifyOtpController));
router.use('/auth' , authRouter);

//User
const userRouter = express.Router();
userRouter.post('/create',grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.USER), createUserController.createUser.bind(createUserController));
userRouter.post('/getAll',grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), readUserController.getUsers.bind(readUserController));
userRouter.get('/getUser/:userId',grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), readUserController.getUser.bind(readUserController));
userRouter.put('/update',grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.USER), updateUserController.updateUser.bind(updateUserController));
userRouter.delete('/delete',grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.USER), destroyUserController.deleteUser.bind(destroyUserController));
router.use('/users' ,allowLoggedIn, checkRoleMiddleware(["superAdmin" , "admin"])  , userRouter);

//Role
const roleRouter = express.Router();
roleRouter.post('/getAll', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), readRoleController.getRoles.bind(readRoleController));
roleRouter.get('/getRole/:roleId', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), readRoleController.getRole.bind(readRoleController));
roleRouter.delete('/delete', grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.ROLE), destroyRoleController.deleteRole.bind(destroyRoleController));
roleRouter.get('/distinct', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), distinctRoleController.distinct.bind(distinctRoleController));
router.use('/roles',allowLoggedIn , checkRoleMiddleware(["superAdmin" , "admin"])   , roleRouter);




export default router