import InitializeController from './initializeController.js'
import jwt from 'jsonwebtoken'
import {
    validationResult
} from 'express-validator'
export default new(class loginController extends InitializeController {

    async login(req, res, next) {
        try {
            let {
                email,
                expiresIn,
                password
            } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.showValidationErrors(res, errors)
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
            // const accessToken = jwt.sign({
            //     userId: admin._id
            // }, process.env.JWT_SECRET, {
            //     expiresIn: expiresIn
            // });
            // await this.model.User.findByIdAndUpdate(admin._id, {
            //     accessToken: accessToken
            // })
            return this.helper.response(res, null, null, 200, Transform)
        } catch (error) {
            next(error);
        }
    };
    async loginWithOTP(req, res, next) {
        try {
            let {
                number,
                optionalLoginToken
            } = req.body;
            const data = await this.helper.otpGenerate(number);
            const {
                configToken,
                configVerify
            } = this.helper;
            const response = await this.helper.axios(configToken.method, configToken.url, configToken.headers, configToken.data)
            console.log(response);
            configVerify.headers["x-sms-ir-secure-token"] = response.data['TokenKey']
            const result = await this.helper.axios(configVerify.method, configVerify.url, configVerify.headers, data)
            console.log(result);
            await this.model.Otp.deleteMany({
                number: number
            })
            this.ok(res, null, result.data.Message, result.data.IsSuccessful)
        } catch (error) {
            next(error)
        }
    };


})()