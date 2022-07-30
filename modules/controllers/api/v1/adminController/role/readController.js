import { InitializeController } from "../../adminController/role/initializeController.js";

export default new (class ReadController extends InitializeController{


    async getRoles  (req, res, next)  {
        let {size , page }= {};
        if(!req.body.page || !req.body.size ) {
            size = 2;
            page = 0;
        }else {
            {size , page }   this.helper.Pagination(req.body);
        }   
        const roles = await this.model.Role.find({}).skip(page*size).limit(Number.parseInt(size));
        return this.helper.response(res , null , null , 200 , roles)
    };

    async getRole (req, res, next) {
        try {
            const roleId = req.params.roleId;
            const role = await this.model.Role.findById(roleId);
            this.helper.response(res , null , null , 200 , role)
            if(!role) this.abort(res , 401 , null , "Role does not exist")
        } catch (error) {
            next(error)
        }
    };

    // getGrants = async function () {
    //     let grantList = [];
    //     const roless = await this.model.Role.find({})
    //     roless.forEach(role => {
    //         role.permissions.forEach(perms => {
    //             grantList.push({
    //                 role: role.role,
    //                 extend: role["extend"],
    //                 resource: perms.resource,
    //                 action: perms.action,
    //                 attributes: perms.attributes,
    //             })
    //         })
    //     });
    //     roless = new AccessControl(grantList)
    //     return roless
    // };



})()