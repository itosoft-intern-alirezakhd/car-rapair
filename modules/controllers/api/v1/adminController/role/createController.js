import User from "../../../../../models/user-model.js";
import {validationResult} from 'express-validator'
import { InitializeController } from "./initializeController.js";
import Role from "../../../../../models/role-model.js";

export default new(class createController extends InitializeController {

    async addRole(req, res, next) {
        try {
            const {
                role,
                extend,
                permissions,
                userId
            } = req.body;
            //check validation
            let errors  = validationResult(req);
            if(!errors.isEmpty()){
                return this.showValidationErrors(res , errors.array())
            }
            if (userId === req.user._id &&
                (req.user.role === "superAdmin" || req.user.role === "admin"))
                     return this.abort(res, 401, null, "you can not add role for own ")
            //find user
            const user = await User.findById(userId);
            if (!user) return this.abort(res, 404, null, "this user does not exist ")
            //check role existing 
            let isRoleExist = await Role.findOne({userRef : user._id , role : role});
        
            if (isRoleExist ) {
                throw new Error('role has already exist')
            }
            //add new role for user
            const newRole = new Role({
                role,
                extend,
                permissions  ,
                userRef: userId
            });
            //update user role
            const findRole = user.role.find((r) => r === role)
            if (!findRole) {
                user.role.push(role);
                await user.save();
            } else {
                return this.abort(res, 401, null, "user has this role")
            }
            //saving role
            await newRole.save();
            this.helper.response(res, 'Role Add successfully', null, 200,newRole);
        } catch (err) {
            next(err);
        }
    };


})()