import isSuperAdminMiddleware from "../../middlewares/is-superAdmin-middleware.js";

//auth 
const authRouter = express.Router();
authRouter.post('/signup', registerController.signUp.bind(registerController) );
authRouter.post('/login', loginController.login.bind(loginController));
authRouter.post('/loginWithOTP', loginController.loginWithOTP.bind(loginController));
authRouter.post('/verifyOTP', loginController.verifyOTP.bind(loginController));
router.use('/auth/super' , authRouter);

//User
const userRouter = express.Router();
userRouter.post('/getAll',grantAccess(TYPE_PERMISSION.READ,  TYPE_RESOURCE.USER), userController.getUsers.bind(userController));
userRouter.post('/create',grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.USER), userController.createUser.bind(userController));
userRouter.put('/update',grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.USER), userController.updateUser.bind(userController));
userRouter.delete('/delete',grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.USER), userController.deleteUser.bind(userController));
router.use('/users' ,allowLoggedIn, isSuperAdminMiddleware , userRouter);

//Role
const roleRouter = express.Router();
roleRouter.post('/create', grantAccess(TYPE_PERMISSION.CREATE, TYPE_RESOURCE.ROLE), roleController.addRole.bind(roleController));
roleRouter.post('/getAll', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), roleController.getRoles.bind(roleController));
roleRouter.put('/update',  grantAccess(TYPE_PERMISSION.UPDATE, TYPE_RESOURCE.ROLE), roleController.updateRole.bind(roleController));
roleRouter.delete('/delete', grantAccess(TYPE_PERMISSION.DELETE, TYPE_RESOURCE.ROLE), roleController.deleteRole.bind(roleController));
roleRouter.get('/distinct', grantAccess(TYPE_PERMISSION.READ, TYPE_RESOURCE.ROLE), roleController.distinct.bind(roleController));
router.use('/roles',allowLoggedIn , isSuperAdminMiddleware , roleRouter);



