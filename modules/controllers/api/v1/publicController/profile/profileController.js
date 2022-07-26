import { InitializeController } from "./initializeController.js";


export default new(class ProfileController extends InitializeController {
    async profile  (req, res, next)  {
        
        try{
            if(req.user){
                const user = await this.model.User.findOne({_id : req.user._id});
                if(!user) return this.abort(res , 404 , null , "user not found!")  
                const result =  {
                    username,
                    contact,
                    name,
                    email,
                    role
                } = user;
                return this.helper.response(res , "successfully" , null , 200 , {user : result} )
            }
        }catch(err){
            next(err);
        }
    };
  
})()