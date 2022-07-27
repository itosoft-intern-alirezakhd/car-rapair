import { InitializeController } from "./initializeController.js";



export default new(class readController extends InitializeController {
    
    async getProfile  (req, res, next)  {
        
        try{
            if(req.user){
                const user = await this.model.User.findOne({_id : req.user._id});
                if(!user) return this.abort(res , 404 , null , "user not found!")  
                let result = {};
                result.username = user.username.toString();
                result.contact = user.contact;
                result.name = user.name;
                result.email = user.email;
                result.role = user.role;
                return this.helper.response(res , "successfully" , null , 200 , {user : result} )
            }
        }catch(err){
            next(err);
        }
    };

})()    