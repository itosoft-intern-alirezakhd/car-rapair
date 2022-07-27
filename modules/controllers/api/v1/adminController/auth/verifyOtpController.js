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
                let admin = await this.model.User.findOne({
                    mobile: rightOtpFind.number
                });
                if (!admin) {
                    return this.abort(res, 400  , null , "admin account doest exist , please signUp")
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
                        userId: admin._id
                    }, process.env.JWT_SECRET, {
                        expiresIn: 36000
                    });
                    await this.model.User.findByIdAndUpdate(admin._id, {accessToken: accessToken , active : true})
                    const role = await this.model.Role.findById({
                        _id : admin.role
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
                            name: admin.name,
                            email: admin.email
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