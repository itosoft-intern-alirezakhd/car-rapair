import emailRegex from 'email-regex'
import InitializeController from './initializeController.js'; 
import jwt from 'jsonwebtoken'
import otpGenerator from 'otp-generator';
import Otp from '../../../../../models/otp-model.js';
import bcrypt from 'bcrypt'
import { data } from 'cheerio/lib/api/attributes.js';


export default new(class RegisterController extends InitializeController {
    //save user => create otp => send otp sms => verify otp => active user
    async signUp  (req, res, next)  {
        try {
            const {name,username,email,password,contact,mobile} = req.body;
            //check validation
            this.helper.checkValidationErr(req , res);
            const role = "user";
            //check existing user
            let user = await this.model.User.findOne({email});
            if(user) return this.abort(res , 422 ,null , "email has already exist" )
            //password hashing
            let hashedPassword = await this.helper.hashPassword(password);
            //create user
            const newUser = new this.model.User({
                name,
                username,
                contact,
                email,
                password: hashedPassword,
                active: false,
                mobile: mobile,
                role : [role]
            });
            // const result = await this.model.Role.findOne({userRef : newUser._id})
            // if (!result) new this.model.Role({role}).save()
            
            // const roleObj = await this.model.Role.findOne({role : role});
            // newUser.role = roleObj._id;

            //create role
            new this.model.Role({
                role,
                userRef : newUser._id,
                permissions : this.helper.basicPermissions
            }).save()

            //saving user
            newUser.save(async (err, user) => {
                if (err) {
                    let message = "";
                    if (err.errors.username)
                        message = `${err.errors.username} `;
                    if (err.errors.email)
                        message += `${err.errors.email} `;
                    if (err.errors.password)
                        message += `${err.errors.password}`;
                    if (err.errors.mobile)
                        message += `${err.errors.mobile}`;
                    message = message.trim();
                    return this.abort(res, 401, null, message);
                } else {
                    //handle verify acc
                    //send otp verfication
                    this.helper.sendOtp(newUser._id, newUser.mobile, res);
                }
            });
        } catch (error) {
            next(error)
        }
    };

})()