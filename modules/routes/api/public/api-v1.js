import express from "express"
import {config} from '../../../../config.js';
const {public : publicController} = config.path.controllersApi.v1
const {middleware } = config.path
const {controller} = config.path

//auth 
import  registerController from '../../../controllers/api/v1/publicController/auth/registerController.js'
import whoController from '../../../controllers/api/v1/publicController/auth/whoController.js'
import loginController from '../../../controllers/api/v1/publicController/auth/loginController.js'
//car
import  carController from '../../../controllers/api/v1/publicController/car/carController.js'
//role
import  roleController from '../../../controllers/api/v1/publicController/role/roleController.js'
//user
import  userController from '../../../controllers/api/v1/publicController/user/userController.js'

//import middleware
import allowLoggedIn from '../../middlewares/allow-loggedIn-middleware.js'
import grantAccess from '../../middlewares/grant-access-middleware.js'

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
profileRouter.get('/', allowLoggedIn, grantAccess('readAny', 'profile'), userController.profile.bind(userController));
router.use('/profile' , profileRouter);


//User
const userRouter = express.Router();
userRouter.post('/getAll', allowLoggedIn, grantAccess('readAny', 'user'), userController.getUsers.bind(userController));
userRouter.post('/create', allowLoggedIn, grantAccess('createAny', 'user'), userController.createUser.bind(userController));
userRouter.put('/update', allowLoggedIn, grantAccess('updateAny', 'user'), userController.updateUser.bind(userController));
userRouter.delete('/delete', allowLoggedIn, grantAccess('deleteAny', 'user'), userController.deleteUser.bind(userController));
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
carRouter.post('/create', allowLoggedIn, carController.addCar.bind(carController))
carRouter.post('/getAll', allowLoggedIn, carController.getAll.bind(carController))
carRouter.put('/update', allowLoggedIn, carController.updateCar.bind(carController))
carRouter.delete('/delete', allowLoggedIn, carController.deleteCar.bind(carController))
router.use('/cars' , carRouter);

export default router