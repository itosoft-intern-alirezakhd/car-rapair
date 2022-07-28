import User from "../../../../../models/user-model.js";
import { InitializeController } from "./initializeController.js";


export default new (class createController extends InitializeController{

    async addRole (req, res, next) {
        try {
            const {
                role,
                extend,
                permissions,
                userId
            } = req.body;
            if(userId  === req.user._id && req.user.role  === "superAdmin" ) return this.abort (res , 401 , null , "you can not add role for own ")
            const user = await User.findById(userId);
            if(!user) return this.abort(res , 404 , null , "this user does not exist ")
            const isRoleExist = await this.model.Role.findOne({role : role })
            if(isRoleExist){
                throw new Error('role has already exist')
            }  
            
            const roles = await this.model.Role.find({userRef : userId});
            roles.forEach(element => {
                if(element.role == role){
                    return this.abort(res , 401 , null , "this role with this user has already exist ")
                }
            });
            //add new role for user
            const newRole = new this.model.Role({
                role,
                extend,
                permissions,
                userRef : userId
            });
            //update user role
            const findRole  = user.role.find((r)=>   r === role  )
            if(!findRole){
                user.role.push(role) ;
                await user.save();
            }else {
                return this.abort(res , 401 , null , "user has this role")
            }
            
            

            try{
                await newRole.save()
                this.helper.response(res , null , null ,200 , {
                    success: true,
                    message: 'Role Add successfully'
                })
                // getGrants();
            }catch{
                res.status(400).json(err.message)
            }
        } catch (err) {
            next(err);
        }
    };
   

})()