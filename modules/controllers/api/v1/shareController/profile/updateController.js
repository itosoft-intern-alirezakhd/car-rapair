import { InitializeController } from "./initializeController.js";



export default new(class updateController extends InitializeController {
    
    async updateProfile  (req, res, next)  {
        try{
            if(req.user){
                let userId = req.user._id;
                const user = await this.model.User.findOne({_id : userId});
                if(!user) return this.abort(res , 404 , null , "user not found!")  
                const {username , contact  , name , email} = req.body;
                let updateUser = {};
                if(username) updateUser.username = username;
                if(contact) updateUser.contact = contact;
                if(name) updateUser.name= name;
                if(email) updateUser.email= email;
                if (Object.keys(updateUser).length === 0)
                    return this.abort(res  ,400 , null , "No items selected"  ) 
                await this.model.User.findByIdAndUpdate(userId , updateUser);
                const returnUser = await this.model.User.findById(userId);
                if(returnUser) return this.helper.response(res , "successfully" , null , 200 , {user : returnUser} )
                else  return this.abort(res  ,400 , null , "user not found"  ) 
            }
        }catch(err){
            next(err);
        }
    };

})()    