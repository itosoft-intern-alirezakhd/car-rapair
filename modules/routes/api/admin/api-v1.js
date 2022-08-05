import express from 'express';
//auth
import registerController from '../../../controllers/api/v1/adminController/auth/registerController.js'
import loginController from '../../../controllers/api/v1/adminController/auth/loginController.js'
//user
import createUserController from "../../../controllers/api/v1/adminController/user/createController.js";
import indexUserController from "../../../controllers/api/v1/adminController/user/indexController.js";
import singleUserController from "../../../controllers/api/v1/adminController/user/singleController.js";
import destroyUserController from "../../../controllers/api/v1/adminController/user/destroyController.js";
import updateUserController from "../../../controllers/api/v1/adminController/user/updateController.js";
//role
import createRoleController from '../../../controllers/api/v1/adminController/role/createController.js'
import updateRoleController from '../../../controllers/api/v1/adminController/role/updateController.js'
import indexRoleController from '../../../controllers/api/v1/adminController/role/indexController.js'
import singleRoleController from '../../../controllers/api/v1/adminController/role/singleController.js'
import destroyRoleController from '../../../controllers/api/v1/adminController/role/destroyController.js'
import distinctRoleController from '../../../controllers/api/v1/adminController/role/distinctController.js'
//car
import  createCarController from '../../../controllers/api/v1/adminController/car/createController.js'
import  readCarController from '../../../controllers/api/v1/adminController/car/readController.js'
import  destroyCarController from '../../../controllers/api/v1/adminController/car/destroyController.js'
import  updateCarController from '../../../controllers/api/v1/adminController/car/updateController.js'
//middleware
import isAdmin from '../../middlewares/admin/is-admin.js'
// import allowLoggedIn from '../../middlewares/share/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/share/grant-access-middleware.js'
import checkRoleMiddleware from '../../middlewares/check-role-middleware.js';
import checkExistCar from '../../middlewares/check-exist-car-middleware.js'

//const 
import { TYPE_PERMISSION } from "../../../helpers/const.js";
import { TYPE_RESOURCE } from "../../../helpers/const.js";
const router = express.Router();

//validation
import registerAdminValidation from '../../../validation/admin/register-validation.js'
import loginAdminValidation from '../../../validation/admin/login-validation.js'
import registerUserValidation from '../../../validation/user/register-validation.js';
import roleAdminValidation from '../../../validation/admin/role-validation.js'
//auth 
const authRouter = express.Router();
authRouter.post('/signup',registerAdminValidation , registerController.signUp.bind(registerController) );
authRouter.post('/login', loginAdminValidation , loginController.login.bind(loginController));
// authRouter.post('/loginWithOTP', loginController.loginWithOTP.bind(loginController));
router.use('/auth' , authRouter);

//User
const userRouter = express.Router();
userRouter.post('/create',registerUserValidation , grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.USER), createUserController.createUser.bind(createUserController));
userRouter.get('/getAll',grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), indexUserController.index.bind(indexUserController));
userRouter.put('/update/:id',grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.USER), updateUserController.updateUser.bind(updateUserController));
userRouter.delete('/delete/:id',grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.USER), destroyUserController.deleteUser.bind(destroyUserController));
userRouter.get('/getUser/:userId',grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), singleUserController.single.bind(singleUserController));
router.use('/users' , isAdmin , checkRoleMiddleware(["superAdmin" , "admin"])  , userRouter);

//Role
const roleRouter = express.Router();
roleRouter.post('/create' , roleAdminValidation , grantAccess(TYPE_PERMISSION.CREATE , TYPE_RESOURCE.ROLE), createRoleController.addRole.bind(createCarController))
roleRouter.get('/getAll', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), indexRoleController.index.bind(indexRoleController));
roleRouter.get('/getRole/:roleId', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), singleRoleController.single.bind(singleRoleController));
roleRouter.delete('/delete/:roleId', grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.ROLE), destroyRoleController.deleteRole.bind(destroyRoleController));
roleRouter.put('/update/:roleId' , grantAccess(TYPE_PERMISSION.UPDATE , TYPE_RESOURCE.ROLE), updateRoleController.updateRole.bind(updateRoleController))
roleRouter.get('/distinct', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), distinctRoleController.distinct.bind(distinctRoleController));
router.use('/roles' , isAdmin , checkRoleMiddleware(["superAdmin" , "admin"])   , roleRouter);

//Car
const carRouter = express.Router();
carRouter.post('/create',createCarController.createCar.bind(createCarController))
carRouter.get('/getAll', readCarController.getAll.bind(readCarController))
carRouter.get('/getCar/:carId', readCarController.getCar.bind(readCarController))
carRouter.put('/update' , updateCarController.updateCar.bind(updateCarController))
carRouter.delete('/delete',destroyCarController.deleteCar.bind(destroyCarController))
router.use('/cars' , checkRoleMiddleware(["superAdmin" , "admin"]) , carRouter);




export default router
