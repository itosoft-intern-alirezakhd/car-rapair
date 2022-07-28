import { InitializeController } from "./initializeController.js";
import Role from '../../../../../models/role-model.js';

export default new (class DestroyController extends InitializeController{
    async deleteUser (req, res, next)  {
        try {
            const userId = req.body._id;
            if (userId === res.locals.loggedInUser._id.toString()) return this.abort(res, 401 , null ,'Not Access!' )
            this.model.User.findByIdAndDelete(userId).then(async (response) => {
                let role = await Role.findOne({userRef : userId, role : res.locals.loggedInUser.role});
                await role.remove();
                if (response) return this.helper.response(res , 'User has been deleted' , null , 200 , {
                    user : response
                }) 
                return this.abort(res, 401 , null,'User Not Found!' ) 
            });
        } catch (error) {
            next(error)
        }
    };

})()