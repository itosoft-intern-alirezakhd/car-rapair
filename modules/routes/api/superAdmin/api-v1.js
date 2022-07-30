import express from 'express';
//auth
import registerController from '../../../controllers/api/v1/superAdminController/auth/registerController.js'
import loginController from '../../../controllers/api/v1/superAdminController/auth/loginController.js'
//role
import createRoleController from '../../../controllers/api/v1/superAdminController/role/createController.js'
import destroyRoleController from '../../../controllers/api/v1/superAdminController/role/destroyController.js'
// //user
// import createUserController from "../../../controllers/api/v1/superAdminController/user/createController.js";
// import readUserController from "../../../controllers/api/v1/superAdminController/user/readController.js";
// import destroyUserController from "../../../controllers/api/v1/superAdminController/user/destroyController.js";
// import updateUserController from "../../../controllers/api/v1/superAdminController/user/updateController.js";
//middleware
import allowLoggedIn from '../../middlewares/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/grant-access-middleware.js'
import isSuperAdminMiddleware from '../../middlewares/check-role-middleware.js';

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

// //User
// const userRouter = express.Router();
// userRouter.post('/create',grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.USER), createUserController.createUser.bind(createUserController));
// userRouter.post('/getAll',grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), readUserController.getUsers.bind(readUserController));
// userRouter.get('/getUser/:userId',grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), readUserController.getUser.bind(readUserController));
// userRouter.put('/update',grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.USER), updateUserController.updateUser.bind(updateUserController));
// userRouter.delete('/delete',grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.USER), destroyUserController.deleteUser.bind(destroyUserController));
// router.use('/users' ,allowLoggedIn, isSuperAdminMiddleware , userRouter);

//Role
const roleRouter = express.Router();
roleRouter.post('/create', grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.ROLE), createRoleController.addRole.bind(createRoleController));
roleRouter.delete('/delete', grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.ROLE), destroyRoleController.deleteRole.bind(destroyRoleController));
router.use('/roles',allowLoggedIn , isSuperAdminMiddleware(["superAdmin"]) , roleRouter);


export default router
