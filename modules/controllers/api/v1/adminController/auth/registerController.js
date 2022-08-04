import InitializeController from './initializeController.js';
import {validationResult} from 'express-validator'

export default new(class RegisterController extends InitializeController {
    //save user => create otp => send otp sms => verify otp => active user
    async signUp(req, res, next) {
        try {
            const {
                name,
                username,
                email,
                password,
                contact,
                mobile,
                registerToken,
                role
            } = req.body;
            //check validation
            let errors  = validationResult(req);
            if(!errors.isEmpty()){
                return this.showValidationErrors(res , errors.array())
            }
            
            if (role === "superAdmin") {
                if (registerToken !== process.env.REGISTER_SUPER_ADMIN_TOKEN.toString() ||
                    email !== process.env.SUPER_ADMIN_EMAIL.toString())
                    return this.abort(res, 401, null, 'you can not register as  superAdmin');
            }

            let user = await this.model.User.findOne({email});
            if(user) return this.abort(res , 422 ,null , "email has already exist" )
            let hashedPassword = await this.helper.hashPassword(password);
            const newAdmin = new this.model.User({
                name,
                username,
                contact,
                email,
                password: hashedPassword,
                active: false,
                mobile: mobile,
                role: [role]
            });

            // newAdmin.accessToken = jwt.sign({
            //     userId: newAdmin._id
            // }, process.env.JWT_SECRET, {
            //     expiresIn: "1d"
            // });
            
            
            // const result = await this.model.Role.findOne({userRef : newUser._id})
            // if (!result) new this.model.Role({role}).save()

            // const roleObj = await this.model.Role.findOne({role : role});
            // newAdmin.role = roleObj._id;

            new this.model.Role({
                role,
                userRef: newAdmin._id,
                permissions: role==="admin" ? this.helper.adminPermissions :  this.helper.superAdminPermissions
            }).save()

            newAdmin.save(async (err, user) => {
                if (err) {
                    let message = "";
                    if (err.errors.username) message = `${err.errors.username} `;
                    if (err.errors.email) message += `${err.errors.email} `;
                    if (err.errors.password) message += `${err.errors.password}`;
                    if (err.errors.mobile) message += `${err.errors.mobile}`;
                    message = message.trim();
                    return this.abort(res, 401, null, message)
                } else {
                    //handle verify acc
                    //send otp verfication
                    this.helper.sendOtp(newAdmin._id, newAdmin.mobile, res);

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



})()