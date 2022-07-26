import InitializeController from './initializeController.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export default new (class VerifyController extends InitializeController{

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
                } else {
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