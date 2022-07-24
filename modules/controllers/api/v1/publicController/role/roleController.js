import {
    AccessControl
} from "accesscontrol";
import { InitializeController } from "./initializeController";


module.exports = new(class RoleController extends InitializeController {

    getGrants = function () {
        let grantList = [];
        const roless = await this.model.Role.find({})
        roless.forEach(role => {
            role.permissions.forEach(perms => {
                grantList.push({
                    role: role.role,
                    extend: role["extend"],
                    resource: perms.resource,
                    action: perms.action,
                    attributes: perms.attributes,
                })
            })
        });
        roless = new AccessControl(grantList)
        return roless
    };


    // let roles = () => {}
    // await getGrants();

    async addRole (req, res, next) {
        try {
            const {
                role,
                extend,
                permissions
            } = req.body;

            const newRole = new this.model.Role({
                role,
                userRef: res.locals.loggedInUser._id,
                extend,
                permissions
            });

            try{
                await newRole.save()
                this.helper.response(res , null , logcode ,200 , {
                    success: true,
                    message: 'Role Add successfully'
                })
                getGrants();
            }catch{
                res.status(400).json(err.message)
            }
        } catch (err) {
            next(err.message);
        }
    };
    async getRoles  (req, res, next)  {
        const roles = await this.model.Role.find({});
        return this.helper.response(res , null , logcode , 200 , roles)
    };
    async getRole (req, res, next) {
        try {
            const roleId = req.params.roleId;
            const role = await this.model.Role.findById(roleId)
            this.helper.response(res , null , logcode , 200 , role)
            if(!role) this.abort(res , 401 , logcode , "Role does not exist")
        } catch (error) {
            next(error)
        }
    };
    async updateRole  (req, res, next) {
        try {
            const update = req.body;
            const roleId = req.body._id;
            console.log(roleId)
            await this.model.Role.findByIdAndUpdate(roleId, update)
            await this.model.Role.findById(roleId);
            this.helper.response(res, null , logcode , 200 ,{
                success: true,
                message: 'Role has been updated'
            } )
            getGrants();
        } catch (error) {
            next(error)
        }
    };
    async deleteRole (req, res, next)  {
        try {
            const roleId = req.body._id;
            await this.model.Role.findByIdAndDelete(roleId);
            this.helper.response(res, null , logcode , 200 ,{
                success: true,
                message: 'Role has been deleted'
            } )
            getGrants();
        } catch (error) {
            next(error)
        }
    }

    async distinct (req, res)  {
        try {
            this.model.Role.distinct('role').then(result => {
                return this.helper.response(res, null , logcode , 200 ,result ) 
            })
        } catch (error) {
            next(error)
        }
    };
})()