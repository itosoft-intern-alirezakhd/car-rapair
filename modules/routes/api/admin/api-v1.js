import express from 'express';
//auth
import registerController from '../../../controllers/api/v1/adminController/auth/registerController.js'
import loginController from '../../../controllers/api/v1/adminController/auth/loginController.js'
//user
import createUserController from "../../../controllers/api/v1/adminController/user/createController.js";
import readUserController from "../../../controllers/api/v1/adminController/user/readController.js";
import destroyUserController from "../../../controllers/api/v1/adminController/user/destroyController.js";
import updateUserController from "../../../controllers/api/v1/adminController/user/updateController.js";
//role
import readRoleController from '../../../controllers/api/v1/adminController/role/readController.js'
import destroyRoleController from '../../../controllers/api/v1/adminController/role/destroyController.js'
import distinctRoleController from '../../../controllers/api/v1/adminController/role/distinctController.js'
//middleware
import allowLoggedIn from '../../middlewares/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/grant-access-middleware.js'
import checkRoleMiddleware from '../../middlewares/check-role-middleware.js';

//const 
import { TYPE_PERMISSION } from "../../../helpers/const.js";
import { TYPE_RESOURCE } from "../../../helpers/const.js";
const router = express.Router();

//auth 
const authRouter = express.Router();
authRouter.post('/signup', registerController.signUp.bind(registerController) );
authRouter.post('/login', loginController.login.bind(loginController));
authRouter.post('/loginWithOTP', loginController.loginWithOTP.bind(loginController));
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
