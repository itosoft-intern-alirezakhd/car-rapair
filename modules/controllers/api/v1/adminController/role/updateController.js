import { InitializeController } from "../../superAdminController/role/initializeController.js";


export default new (class updateController extends InitializeController{

    async updateRole  (req, res, next) {
        try {
            const {role , extend , permissions } = req.body;
            let roleId  = req.params.roleId
            let updateRole = {};
            if(role) updateRole.role  = role;
            if(extend) updateRole.extend  = extend;
            if(permissions) updateRole.permissions  = permissions;
            if(updateRole  === {})
                return this.abort(res , 400 , null , "information for updating role is not enough")
            
            await this.model.Role.findByIdAndUpdate(roleId, updateRole)
            this.helper.response(res, null , null , 200 ,{
                success: true,
                message: 'Role has been updated'
            } )
            // getGrants();
        } catch (error) {
            next(error)
        }
    };

})()