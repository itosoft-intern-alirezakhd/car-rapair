import InitializeController from '../../adminController/auth/initializeController.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {validationResult} from 'express-validator'

export default new (class VerifyController extends InitializeController{

    async verifyOTP(req, res,next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return this.showValidationErrors(res, errors)
            }
            const optHolder = await this.model.Otp.findOne({
                number: req.body.number
            });
            if (optHolder.length === 0) return this.abort(res, 400 , null , "You use an Expired OTP!") 
            const rightOtpFind = optHolder;
            const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)
            if (rightOtpFind.number === req.body.number && validUser) {
                let user = await this.model.User.findOne({
                    mobile: rightOtpFind.number
                });
                if (!user) {
                    return this.abort(res, 400  , null , "this account doest not exist , please signUp")
                } else {
                    await this.model.User.findByIdAndUpdate(user._id, { active : true})
                    const roles = await this.model.Role.find({
                        userRef : user._id
                    })
                    await this.model.Otp.deleteMany({
                        number: rightOtpFind.number
                    })
                    user.permissions =  (roles.map((r)=> r.permissions ))
                    const Transform = await this.helper.transform(
                        user,
                        this.helper.itemTransform,
                        false,
                        user.role[0]
                    )
                    return this.helper.response(res,  "verify Otp successfully", null ,200 , Transform)
                }
            } else return this.abort(res , 400 , null , "You use an Expired OTP!") 
        } catch (error) {
            next(error)
        }
    };
})()