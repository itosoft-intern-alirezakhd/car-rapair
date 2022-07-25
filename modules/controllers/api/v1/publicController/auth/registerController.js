import emailRegex from 'email-regex'
import InitializeController from './initializeController.js'; 
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator';
import Otp from '../../../../../models/otp-model.js';
import bcrypt from 'bcrypt'


export default new(class RegisterController extends InitializeController {
    //save user => create otp => send otp sms => verify otp
    async signUp  (req, res, next)  {
        try {
            const {name,username,email,password,contact,mobile} = req.body;
            const role = "basic"
            if (!emailRegex({
                        exact: true
                    }).test(email)) return this.abort(res , 401 , null , "ایمیل با فرمت درست وارد شود" ) 

            let hashedPassword
            if (password) hashedPassword = await this.helper.hashPassword(password);
            else hashedPassword = "undefined"
            const newUser = new this.model.User({
                name,
                username,
                contact,
                email,
                password: hashedPassword,
                active: false,
                mobile: mobile,
                role: role
            });
            newUser.accessToken = jwt.sign({
                userId: newUser._id
            }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            // const result = await this.model.Role.findOne({userRef : newUser._id})
            // if (!result) new this.model.Role({role}).save()
            new this.model.Role({
                role,
                userRef : newUser._id,
            }).save()

            await newUser.save(async (err, user) => {
                if (err) {
                    let message = "";
                    if (err.errors.username) message = `${err.errors.username} `;
                    if (err.errors.email) message += `${err.errors.email} `;
                    if (err.errors.password) message += `${err.errors.password}`;
                    if (err.errors.mobile) message += `${err.errors.mobile}`;
                    message = message.trim();
                    return this.abort(res , 401 , null , message ) 
                } else {
                    //handle verify acc
                    //send otp verfication
                    this.sendOtp(newUser._id , newUser.mobile, res);
                    
                    // await this.model.Otp.deleteMany({
                    //     number: otp.number
                    // })

                    // return this.ok(res , 200 , null , "User registrations is successful.") 
                }
            });
        
        } catch (error) {
            next(error)
        }
    };


    async sendOtp(_id , number , res ){
        const OTPCode = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        const otp = new this.model.Otp({
            number: number,
            otp: OTPCode
        })
        const salt = await bcrypt.genSalt(10)
        otp.otp = await bcrypt.hash(otp.otp, salt);
        otp.userId = _id;
        await otp.save()
        console.log(OTPCode)
        const data = JSON.stringify({
            Code: OTPCode,
            MobileNumber: number
        });
        res.json({
            status : "Pending",
            message : "verification code sent",
            data : {
                userId : _id ,
                number : number,
                otp : OTPCode
            }
        })
    }

})()