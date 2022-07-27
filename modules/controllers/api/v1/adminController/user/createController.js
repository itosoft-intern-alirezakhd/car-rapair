import { InitializeController } from "./initializeController.js"
import jwt from 'jsonwebtoken'
import Role from '../../../../../models/role-model.js';



export default new ( class CreateController extends InitializeController{
    async createUser (req , res ,next) {
        try{
            const {name,username,email,password,contact,mobile,role="basic",active=false} = req.body;
            let hashedPassword;
            if (password) hashedPassword = await this.helper.hashPassword(password);
            else hashedPassword = "undefined";

            const newUser = new this.model.User({
                name,
                username,
                contact,
                email,
                password: hashedPassword,
                active: active,
                mobile: mobile,
                
            });
            newUser.accessToken = jwt.sign({
                userId: newUser._id
            }, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });

            const roleObj = await this.model.Role.findOne({role : role});
            newUser.role = roleObj._id;
            
            // await new Role({
            //     role,
            //     userRef : newUser._id,
            //     permissions : permissions
            // }).save()

            const user = await newUser.save();
            if(!user) this.abort(res , 400 , null , 'user saving unsuccessful')
            this.helper.response(res ,"User registrations is successful." , null , 200 , user) 
        }catch(err){
            next(err)
        }
        // jwt.verify(req.body.registerToken, process.env.JWT_SECRET, async (err, decoded) => {
        //     if (err && err.message)
        //         return this.abort(res , 401 , null ,`${err.message}, please login to obtain a new one` )
        //     const otp = await this.model.Otp.findById(decoded.userId)
        //     if (!otp) return this.abort(res , 400 , null ,"You use an Expired OTP!" ) 
        // });
    }



    // async authentication (req, res) {
    //     try {
    //         const user = res.locals.loggedInUser;
    //         if (user) {
    //             const userObj = {};
    //             userObj.username = user.username;
    //             userObj.email = user.email;
    //             userObj.role = user.role;
    //             userObj.active = user.active;
    //             return res.json({
    //                 success: true,
    //                 ...userObj
    //             })
    //         } else return res.json({
    //             success: false,
    //             user: null
    //         })
    //     } catch (error) {
    //         res.json({
    //             error: error.message
    //         });
    //     }
    // };

})()