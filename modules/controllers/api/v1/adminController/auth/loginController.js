import InitializeController from './initializeController.js'
import {validationResult} from 'express-validator'

export default new(class loginController extends InitializeController {

    async login(req, res, next) {
        try {
            let {
                email,
                expiresIn,
                password
            } = req.body;
            let errors  = validationResult(req);
            if(!errors.isEmpty()){
                return this.showValidationErrors(res , errors.array())
            }
            let admin = await this.model.User.findOne({
                email
            });
            if (!expiresIn) expiresIn = 36000;
            if (!admin) return this.abort(res, 403, null, 'email does not exist')
            // if (!superAdmin.active) return this.abort(res,403,null , 'User not activated')
            const validPassword = await this.helper.validatePassword(password, admin.password);
            if (!validPassword) return this.abort(res, 403, null, 'Password is not correct');
            const roles = await this.model.Role.find({
                userRef: admin._id
            })
            admin.permissions = roles.map((r) => r.permissions);
            const Transform = await this.helper.transform(
                admin,
                this.helper.itemTransform,
                false,
                admin.role[0]
            )
            return this.helper.response(res, null, null, 200, Transform)
        } catch (error) {
            next(error);
        }
    };
})()