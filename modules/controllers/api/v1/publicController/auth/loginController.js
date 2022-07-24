import { next } from 'cheerio/lib/api/traversing';
import otpGenerator from 'otp-generator'
import {
    InitializeController
} from './initializeController'


module.exports = new(class loginController extends InitializeController {

    async login(req, res, next) {
        try {
            let {username,expiresIn,password} = req.body;
            let user = await this.model.User.findOne({username});
            if (!expiresIn) expiresIn = 36000;
            if (!user) return this.abort(res,403,logcode , 'Username does not exist')
            if (!user.active) return this.abort(res,403,logcode , 'User not activated')
            const validPassword = await this.helper.validatePassword(password, user.password);
            if (!validPassword) return this.abort(res,403,logcode , 'Password is not correct');
            const accessToken = jwt.sign({
                userId: user._id
            }, process.env.JWT_SECRET, {
                expiresIn: expiresIn
            });
            await this.model.User.findByIdAndUpdate(user._id, {
                accessToken: accessToken
            })
            const role = await this.model.Role.findOne({
                role: user.role
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
            return this.helper.response(res , null , logcode , 200 , data )
        } catch (error) {
            next(error);
        }
    };
    async loginWithOTP(req, res) {
        try {

            let {number , optionalLoginToken} = req.body;
            const OTP = otpGenerator.generate(6, {
                digits: true,
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            })
            const otp = new this.model.Otp({
                number: number,
                otp: OTP
            })
            const salt = await bcrypt.genSalt(10)
            otp.otp = await bcrypt.hash(otp.otp, salt)
            await otp.save()
            console.log(OTP)
            const data = JSON.stringify({
                Code: OTP,
                MobileNumber: number
            });
           const {configToken, configVerify} = this.helper;
           const response = await this.helper.axios(configToken.method, configToken.url, configToken.headers, configToken.data)
           configVerify.headers["x-sms-ir-secure-token"] = response.data['TokenKey']
           const result = await this.helper.axios(configVerify.method,configVerify.url,configVerify.headers,data)
           this.ok(res , 200 , logcode , result.data.Message , result.data.IsSuccessful )
        } catch (error) {
            next(error)
        }
    };
    async verifyOTP(req, res) {
        try {
            const optHolder = await this.model.Otp.find({
                number: req.body.number
            });
            if (optHolder.length === 0) return this.abort(res, 400 , logcode , "You use an Expired OTP!") 
            const rightOtpFind = optHolder[optHolder.length - 1];
            const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)

            if (rightOtpFind.number === req.body.number && validUser) {
                let user = await this.model.User.findOne({
                    mobile: rightOtpFind.number
                });
                if (!user) {
                    const otp = jwt.sign({
                        userId: rightOtpFind._id
                    }, process.env.JWT_SECRET, {
                        expiresIn: 36000
                    });
                    await this.model.Otp.findByIdAndUpdate(rightOtpFind._id, {otp: otp})
                    const data = {
                        status: true,
                        register: false,
                        registerToken: otp,
                        number: rightOtpFind.number
                    }
                    return this.ok(res , 200 , logcode , data)
                } else {
                    if (!user.active) return this.abort(res , 403 , logcode ,'User not activated' ) 
                    const accessToken = jwt.sign({
                        userId: user._id
                    }, process.env.JWT_SECRET, {
                        expiresIn: 36000
                    });
                    await this.model.User.findByIdAndUpdate(user._id, {accessToken: accessToken})
                    const role = await this.model.Role.findOne({
                        role: user.role
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
                            name: user.name,
                            email: user.email
                        },
                        permissions: role.permissions,
                    }
                    return this.ok(res,  200 , logcode , data)
                }
            } else return this.abort(res , 400 , logcode , "You use an Expired OTP!") 
        } catch (error) {
            next(error)
        }
    };

})()