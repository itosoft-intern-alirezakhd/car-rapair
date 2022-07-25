


//auth 
const authRouter = express.Router();
authRouter.post('/signup', registerController.signUp.bind(registerController) );
authRouter.post('/login', loginController.login.bind(loginController));
authRouter.post('/loginWithOTP', loginController.loginWithOTP.bind(loginController));
authRouter.post('/verifyOTP', loginController.verifyOTP.bind(loginController));
authRouter.get('/whoAmI', allowLoggedIn, whoController.whoAmI.bind(whoController));
router.use('/auth/basic' , authRouter);


//profile 
const profileRouter = express.Router();
profileRouter.get('/', allowLoggedIn, grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.PROFILE), userController.profile.bind(userController));
router.use('/profile' , profileRouter);


//User
const userRouter = express.Router();
userRouter.post('/getAll', allowLoggedIn, grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), userController.getUsers.bind(userController));
userRouter.post('/create', allowLoggedIn, grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.USER), userController.createUser.bind(userController));
userRouter.put('/update', allowLoggedIn, grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.USER), userController.updateUser.bind(userController));
userRouter.delete('/delete', allowLoggedIn, grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.USER), userController.deleteUser.bind(userController));
router.use('/users' , userRouter);



//Role
const roleRouter = express.Router();
roleRouter.post('/create', allowLoggedIn , grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.ROLE), roleController.addRole.bind(roleController));
roleRouter.post('/getAll', allowLoggedIn, grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), roleController.getRoles.bind(roleController));
roleRouter.put('/update', allowLoggedIn, grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.ROLE), roleController.updateRole.bind(roleController));
roleRouter.delete('/delete', allowLoggedIn, grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.ROLE), roleController.deleteRole.bind(roleController));
roleRouter.get('/distinct', allowLoggedIn, grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), roleController.distinct.bind(roleController));
router.use('/roles' , roleRouter);



