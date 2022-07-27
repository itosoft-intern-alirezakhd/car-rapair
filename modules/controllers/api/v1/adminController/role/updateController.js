import { InitializeController } from "./initializeController.js";


export default new (class updateController extends InitializeController{

    async updateRole  (req, res, next) {
        try {
            const update = req.body;
            const roleId = req.body.roleId;
            console.log(roleId)
            await this.model.Role.findByIdAndUpdate(roleId, update)
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