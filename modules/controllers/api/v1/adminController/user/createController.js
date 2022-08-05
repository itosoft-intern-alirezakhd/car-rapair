import { InitializeController } from "./initializeController.js"
import jwt from 'jsonwebtoken'
import Role from '../../../../../models/role-model.js';
import {validationResult} from 'express-validator'

export default new ( class CreateController extends InitializeController{
    async createUser (req , res ,next) {
        try{
            const {name,username,email,password,contact,mobile,role="user",active=false,permissions} = req.body;
            
            //check validation
            let errors  = validationResult(req);
            if(!errors.isEmpty()){
                return this.showValidationErrors(res , errors.array())
            }
            //hashing password
            let hashedPassword = await this.helper.hashPassword(password);
            //create user
            const newUser = new this.model.User({
                name,
                username,
                contact,
                email,
                password: hashedPassword,
                active: active,
                mobile: mobile,
                role :[role]
            });
            //create Role
            await new Role({
                role,
                userRef : newUser._id,
                permissions : permissions
            }).save();
            //saving user in db
            const user = await newUser.save();
            if(!user) this.abort(res , 400 , null , 'user saving unsuccessful');
            //send response
            return this.helper.response(res ,"User registrations is successful." , null , 200 , user) 
        }catch(err){
            next(err)
        }
    }
})()