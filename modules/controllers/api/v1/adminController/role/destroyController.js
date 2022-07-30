import User from "../../../../../models/user-model.js";
import { InitializeController } from "./initializeController.js";


export default new (class destroyController extends InitializeController{

    async deleteRole (req, res, next)  {
        try {
            const roleId = req.body.roleId;
            const role = await this.model.Role.findByIdAndDelete(roleId);
            if(!role) return this.abort(res , 404 , null , "role not found")
            const user = await User.findById(role.userRef);
            const newArr = user.role.filter(e => e !== role.role );
            if(newArr.length === 0) user.remove();
            else{
                user.role = newArr;
                await user.save()
            }
            this.helper.response(res, null , null , 200 ,{
                success: true,
                message: 'Role has been deleted'
            })
            
            // getGrants();
        } catch (error) {
            next(error)
        }
    }

})()