import otpGenerator from 'otp-generator'
import Otp from '../../../../../models/otp-model.js';
import InitializeController from './initializeController.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default new(class loginController extends InitializeController {

    async login(req, res, next) {
        try {
            let {
                email,
                expiresIn,
                password
            } = req.body;
            //check validation
            this.helper.checkValidationErr(req , res);

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