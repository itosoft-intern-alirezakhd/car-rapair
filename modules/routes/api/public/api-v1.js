const express = require('express');
const config = require('./config');
const {public : publicController} = config.path.controllersApi.v1
const {middleware } = config.path
const {controller} = config.path


//auth 
const registerController = require(`${publicController}/auth/registerController`) 
const whoController = require(`${publicController}/auth/whoController`) 
const loginController = require(`${publicController}/auth/loginController`) 
//car
const carController = require(`${publicController}/car/carController`) 
//role
const roleController = require(`${publicController}/role/roleController`) 
//user
const userController = require(`${publicController}/user/userController`) 
 
//import middleware
const allowLoggedIn = require(`${middleware}/allow-loggedIn-middleware`) 
const grantAccess = require(`${middleware}/grant-access-middleware`) 

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

module.exports = router