import otpGenerator from 'otp-generator'
import Otp from '../../../../../models/otp-model.js';
import InitializeController from './initializeController.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default new(class loginController extends InitializeController {

    async login(req, res, next) {
        try {
            let {username,expiresIn,password} = req.body;
            let superAdmin = await this.model.User.findOne({username});
            if (!expiresIn) expiresIn = 36000;
            if (!superAdmin) return this.abort(res,403,null , 'Username does not exist')
            if (!superAdmin.active) return this.abort(res,403,null , 'User not activated')
            const validPassword = await this.helper.validatePassword(password, user.password);
            if (!validPassword) return this.abort(res,403,null , 'Password is not correct');
            const accessToken = jwt.sign({
                userId: superAdmin._id
            }, process.env.JWT_SECRET, {
                expiresIn: expiresIn
            });
            await this.model.User.findByIdAndUpdate(superAdmin._id, {
                accessToken: accessToken
            })
            const role = await this.model.Role.findOne({
                userRef : superAdmin._id
            })
            const data = {
                status: 200,
                family: "SUCCESSFUL",
                data: accessToken,
                exp: jwt.decode(accessToken).exp,
                profile: {
                    name: superAdmin.name,
                    email: superAdmin.email
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
           console.log(response);
           configVerify.headers["x-sms-ir-secure-token"] = response.data['TokenKey']
           const result = await this.helper.axios(configVerify.method,configVerify.url,configVerify.headers,data)
           console.log(result);
           await this.model.Otp.deleteMany({number: number})
           this.ok(res  , null , result.data.Message , result.data.IsSuccessful )
        } catch (error) {
            next(error)
        }
    };
    async verifyOTP(req, res,next) {
        try {
            const optHolder = await this.model.Otp.findOne({
                number: req.body.number
            });
            if (optHolder.length === 0) return this.abort(res, 400 , null , "You use an Expired OTP!") 
            const rightOtpFind = optHolder;
            const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)
            if (rightOtpFind.number === req.body.number && validUser) {
                let superAdmin = await this.model.User.findOne({
                    mobile: rightOtpFind.number
                });
                if (!superAdmin) {
                    return this.abort(res, 400  , null , "superAdmin account doest exist , please signUp")
                    // const otp = jwt.sign({
                    //     userId: rightOtpFind._id
                    // }, process.env.JWT_SECRET, {
                    //     expiresIn: 36000
                    // });
                    // await this.model.Otp.findByIdAndUpdate(rightOtpFind._id, {otp: otp})
                    // const data = {
                    //     status: true,
                    //     register: false,
                    //     registerToken: otp,
                    //     number: rightOtpFind.number
                    // }
                    // return this.ok(res , 200 , null , data)
                } else {
                    // if (!user.active) return this.abort(res , 403 , null ,'User not activated' ) 
                    const accessToken = jwt.sign({
                        userId: superAdmin._id
                    }, process.env.JWT_SECRET, {
                        expiresIn: 36000
                    });
                    await this.model.User.findByIdAndUpdate(superAdmin._id, {accessToken: accessToken , active : true})
                    const role = await this.model.Role.findOne({
                        userRef : superAdmin._id
                    })
                    await this.model.Otp.deleteMany({
                        number: rightOtpFind.number
                    })
                    const data = {
                        status: true,
                        register: true,
                        family: "SUCCESSFUL",
                        data: accessToken,
                        exp: jwt.decode(accessToken).exp,
                        profile: {
                            name: superAdmin.name,
                            email: superAdmin.email
                        },
                        permissions: role.permissions,
                    }
                    return this.ok(res,  200 , null , data)
                }
            } else return this.abort(res , 400 , null , "You use an Expired OTP!") 
        } catch (error) {
            next(error)
        }
    };

})()