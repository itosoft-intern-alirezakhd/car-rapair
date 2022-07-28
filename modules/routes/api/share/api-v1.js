import express from 'express';
//auth
import registerController from '../../../controllers/api/v1/superAdminController/auth/registerController.js'
import loginController from '../../../controllers/api/v1/superAdminController/auth/loginController.js'
import verifyOtpController from "../../../controllers/api/v1/superAdminController/auth/verifyOtpController.js";
//user
import createUserController from "../../../controllers/api/v1/share/user/createController.js";
import readUserController from "../../../controllers/api/v1/share/user/readController.js";
import destroyUserController from "../../../controllers/api/v1/share/user/destroyController.js";
import updateUserController from "../../../controllers/api/v1/share/user/updateController.js";
//role
import createRoleController from '../../../controllers/api/v1/share/role/createController.js'
import readRoleController from '../../../controllers/api/v1/share/role/readController.js'
import updateRoleController from '../../../controllers/api/v1/share/role/updateController.js'
import destroyRoleController from '../../../controllers/api/v1/share/role/destroyController.js'
import distinctRoleController from '../../../controllers/api/v1/share/role/distinctController.js'
//middleware
import allowLoggedIn from '../../middlewares/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/grant-access-middleware.js'
//const 
import { TYPE_PERMISSION } from "../../../helpers/const.js";
import { TYPE_RESOURCE } from "../../../helpers/const.js";
import isAdminMiddleware from "../../middlewares/is-admin-middleware.js";
import checkRoleMiddleware from '../../middlewares/check-role-middleware.js';
const router = express.Router();

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
roleRouter.post('/create', grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.ROLE), createRoleController.addRole.bind(createRoleController));
roleRouter.post('/getAll', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), readRoleController.getRoles.bind(readRoleController));
roleRouter.get('/getRole/:roleId', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), readRoleController.getRole.bind(readRoleController));
roleRouter.put('/update',  grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.ROLE), updateRoleController.updateRole.bind(updateRoleController));
roleRouter.delete('/delete', grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.ROLE), destroyRoleController.deleteRole.bind(destroyRoleController));
roleRouter.get('/distinct', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), distinctRoleController.distinct.bind(distinctRoleController));
router.use('/roles',allowLoggedIn , checkRoleMiddleware(["superAdmin" , "admin"])   , roleRouter);


export default router