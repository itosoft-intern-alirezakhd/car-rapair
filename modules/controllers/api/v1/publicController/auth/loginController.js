import otpGenerator from 'otp-generator'
import Otp from '../../../../../models/otp-model.js';
import InitializeController from './initializeController.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default new(class loginController extends InitializeController {

    async login(req, res, next) {
        try {
            let {username,expiresIn,password} = req.body;
            let user = await this.model.User.findOne({username});
            if (!expiresIn) expiresIn = 36000;
            if (!user) return this.abort(res,403,null , 'Username does not exist')
            if (!user.active) return this.abort(res,403,null , 'User not activated')
            const validPassword = await this.helper.validatePassword(password, user.password);
            if (!validPassword) return this.abort(res,403,null , 'Password is not correct');
            const accessToken = jwt.sign({
                userId: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: expiresIn
            });
            await this.model.User.findByIdAndUpdate(user._id, {
                accessToken: accessToken
            })
            const role = await this.model.Role.findOne({
                userRef : user._id
            })
            const data = {
                status: 200,
                family: "SUCCESSFUL",
                data: accessToken,
                exp: jwt.decode(accessToken).exp,
                profile: {
                    name: user.name,
                    email: user.email
                },
                permissions: role.permissions,
            }
            return this.helper.response(res , null , null , 200 , data )
        } catch (error) {
            next(error);
        }
    };
    async loginWithOTP(req, res , next) {
        try {
            let {number , optionalLoginToken} = req.body;
           const data = await this.helper.otpGenerate(number);
           const {configToken, configVerify} = this.helper;
           const response = await this.helper.axios(configToken.method, configToken.url, configToken.headers, configToken.data)
           configVerify.headers["x-sms-ir-secure-token"] = response.data['TokenKey']
           const result = await this.helper.axios(configVerify.method,configVerify.url,configVerify.headers,data)
           await this.model.Otp.deleteMany({number: number})
           this.ok(res  , null , result.data.Message , result.data.IsSuccessful )
        } catch (error) {
            next(error)
        }
    };
})()