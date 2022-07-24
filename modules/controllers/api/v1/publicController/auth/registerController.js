import emailRegex from 'email-regex'
import InitializeController from './initializeController.js'; 


export default new(class RegisterController extends InitializeController {

    async signUp  (req, res, next)  {
        try {
            jwt.verify(req.body.registerToken, process.env.JWT_SECRET, async (err, decoded) => {
                if (err && err.message)
                    return this.abort(res , 401 , logcode ,`${err.message}, please login to obtain a new one` )
                const otp = await this.model.Otp.findById(decoded.userId)
                if (!otp) return this.abort(res , 400 , logcode ,"You use an Expired OTP!" ) 
                const {name,username,email,password,contact} = req.body;
                const role = "basic"
                if (!emailRegex({
                        exact: true
                    }).test(email)) return this.abort(res , 401 , logcode , "ایمیل با فرمت درست وارد شود" ) 

                let hashedPassword
                if (password) hashedPassword = await this.helper.hashPassword(password);
                else hashedPassword = "undefined"
                const newUser = new User({
                    name,
                    username,
                    contact,
                    email,
                    password: hashedPassword,
                    active: false,
                    mobile: otp.number,
                    role: role
                });
                newUser.accessToken = jwt.sign({
                    userId: newUser._id
                }, process.env.JWT_SECRET, {
                    expiresIn: "1d"
                });
                const result = await this.model.Role.findOne({role: role})
                if (!result) new this.model.Role({role}).save()
                
                await newUser.save(async (err, user) => {
                    if (err) {
                        let message = "";
                        if (err.errors.username) message = `${err.errors.username} `;
                        if (err.errors.email) message += `${err.errors.email} `;
                        if (err.errors.password) message += `${err.errors.password}`;
                        if (err.errors.mobile) message += `${err.errors.mobile}`;
                        message = message.trim();
                        return this.abort(res , 401 , logcode , message ) 
                    } else {
                        await this.model.Otp.deleteMany({
                            number: otp.number
                        })
                        return this.ok(res , 200 , logcode , "User registrations is successful.") 
                    }
                });
            });
        } catch (error) {
            next(error)
        }
    };

})()