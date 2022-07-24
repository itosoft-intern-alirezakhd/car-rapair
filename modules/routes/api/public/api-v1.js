import express from "express"
import config from '../../../../config';
const {public : publicController} = config.path.controllersApi.v1
const {middleware } = config.path
const {controller} = config.path

//import Controller
import * as roleController from `${controller}/rolesController`
import * as userController from `${controller}/usersController`

//auth 
import  registerController from `${publicController}/auth/registerController`
import whoController from `${publicController}/auth/whoController`
import * as loginController from `${publicController}/auth/loginController`
//car
import * as carController from `${publicController}/car/carController`
//role
import * as roleController from `${publicController}/role/roleController`
//user
import * as userController from `${publicController}/user/userController`
 
//import middleware
import allowLoggedIn from `${middleware}/allow-loggedIn-middleware`
import grantAccess from `${middleware}}/grant-access-middleware`

//Router
const router = express.Router();

//auth 
const authRouter = express.Router();
authRouter.post('/signup', registerController.signUp.bind(registerController) );
authRouter.post('/login', loginController.login.bind(loginController));
authRouter.post('/loginWithOTP', loginController.loginWithOTP.bind(loginController));
authRouter.post('/verifyOTP', loginController.verifyOTP.bind(loginController));
authRouter.get('/whoAmI', allowLoggedIn, whoController.whoAmI.bind(whoController));
router.use('/auth' , authRouter);


//profile 
const profileRouter = express.Router();
profileRouter.get('/', allowLoggedIn, grantAccess('readAny', 'profile'), User.profile);
router.use('/profile' , profileRouter);



//User
const userRouter = express.Router();
userRouter.post('/getAll', allowLoggedIn, grantAccess('readAny', 'user'), userController.getUsers.bind(userController));
userRouter.post('/create', allowLoggedIn, grantAccess('createAny', 'user'), userController.signUp.bind(userController));
userRouter.put('/update', allowLoggedIn, grantAccess('updateAny', 'user'), userController.updateUser.bind(userController));
userRouter.delete('/delete', allowLoggedIn, grantAccess('deleteAny', 'user'), userController.dele.bind(userController));
router.use('/users' , userRouter);


//Role
const roleRouter = express.Router();
roleRouter.post('/create', allowLoggedIn, grantAccess('createAny', 'role'), roleController.addRole.bind(roleController));
roleRouter.post('/getAll', allowLoggedIn, grantAccess('readAny', 'role'), roleController.getRoles.bind(roleController));
roleRouter.put('/update', allowLoggedIn, grantAccess('updateAny', 'role'), roleController.updateRole.bind(roleController));
roleRouter.delete('/delete', allowLoggedIn, grantAccess('deleteAny', 'role'), roleController.deleteRole.bind(roleController));
roleRouter.get('/distinct', allowLoggedIn, grantAccess('readAny', 'role'), roleController.distinct.bind(roleController));
router.use('/roles' , roleRouter);


//Car
const carRouter = express.Router();
carRouter.post('/cars/create', allowLoggedIn, carController.addCar.bind(carController))
carRouter.post('/cars/getAll', allowLoggedIn, carController.getAll.bind(carController))
carRouter.put('/cars/update', allowLoggedIn, carController.updateCar.bind(carController))
carRouter.delete('/cars/delete', allowLoggedIn, carController.deleteCar.bind(carController))
router.use('/cars' , carRouter);

export default router