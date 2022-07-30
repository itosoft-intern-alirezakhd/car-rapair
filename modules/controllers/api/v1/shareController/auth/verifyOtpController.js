import InitializeController from '../../superAdminController/auth/initializeController.js'
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
                let user = await this.model.User.findOne({
                    mobile: rightOtpFind.number
                });
                if (!user) {
                    return this.abort(res, 400  , null , "this account doest not exist , please signUp")
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
                        userId: user._id
                    }, process.env.JWT_SECRET, {
                        expiresIn: 36000
                    });
                    await this.model.User.findByIdAndUpdate(user._id, {accessToken: accessToken , active : true})
                    console.log(user);
                    const roles = await this.model.Role.find({
                        userRef : user._id
                    })
                    await this.model.Otp.deleteMany({
                        number: rightOtpFind.number
                    })
                    console.log(roles);

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
                        permissions: (roles.map((r)=> r.permissions )),
                    }
                    console.log("AFDEGF");
                    console.log(data);
                    return this.helper.response(res,  "verify Otp successfully", null ,200 , data)
                }
            } else return this.abort(res , 400 , null , "You use an Expired OTP!") 
        } catch (error) {
            next(error)
        }
    };


})()