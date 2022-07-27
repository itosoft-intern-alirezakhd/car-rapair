import { InitializeController } from "./initializeController.js";


export default new (class createController extends InitializeController{

    async addRole (req, res, next) {
        try {
            const {
                role,
                extend,
                permissions
            } = req.body;
            const isRoleExist = await this.model.Role.findOne({role : role })
            if(isRoleExist){
                throw new Error('role has already exist')
            }  
            const newRole = new this.model.Role({
                role,
                extend,
                permissions
            });
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