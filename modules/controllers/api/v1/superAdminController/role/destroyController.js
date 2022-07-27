import { InitializeController } from "./initializeController.js";


export default new (class destroyController extends InitializeController{

    async deleteRole (req, res, next)  {
        try {
            const roleId = req.body.roleId;
            await this.model.Role.findByIdAndDelete(roleId);
            this.helper.response(res, null , null , 200 ,{
                success: true,
                message: 'Role has been deleted'
            } )
            // getGrants();
        } catch (error) {
            next(error)
        }
    }

})()