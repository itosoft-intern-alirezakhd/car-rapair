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
            //check validation
            let errors  = validationResult(req);
            if(!errors.isEmpty()){
                return this.showValidationErrors(res , errors.array())
            }
            let user = await this.model.User.findOne({
                email
            });
            if (!expiresIn) expiresIn = 36000;
            if (!user) return this.abort(res, 403, null, 'Username does not exist')
            // if (!user.active) return this.abort(res,403,null , 'User not activated')
            const validPassword = await this.helper.validatePassword(password, user.password);
            if (!validPassword) return this.abort(res, 403, null, 'Password is not correct');
            const roles = await this.model.Role.find({
                userRef: user._id
            })
            user.permissions = roles.map((r) => r.permissions);
            const Transform = await this.helper.transform(
                user,
                this.helper.itemTransform,
                false,
                user.role[0]
            )
            return this.helper.response(res, null, null, 200, Transform)
        } catch (error) {
            next(error);
        }
    };
})()