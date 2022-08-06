import User from "../../../../../models/user-model.js";
import {
    InitializeController
} from "./initializeController.js";


export default new(class updateController extends InitializeController {

    async updateRole(req, res, next) {
        try {
            const {
                role,
                extend,
                permissions
            } = req.body;
            let roleId = req.params.roleId;
            if (!roleId) return this.abort(res, 400, null, "roleId is undefined")
            let updateRole = {};
            if (role) updateRole.role = role;
            if (extend) updateRole.extend = extend;
            if (permissions) updateRole.permissions = permissions;
            if (updateRole === {})
                return this.abort(res, 400, null, "information for updating role is not enough")

            let prevRole = await this.model.Role.findById(roleId);
            const user = await User.findById(prevRole.userRef);
            let roleName = prevRole.role;
            let roleIndex = user.role.findIndex(e => e === roleName);
            user.role[roleIndex] = role;
            user.markModified('role');
            await user.save()
            await this.model.Role.findByIdAndUpdate(roleId, updateRole);
            let result = await this.model.Role.findById(roleId);
            this.helper.response(res, 'Role has been updated', null, 200, result)
            // getGrants();
        } catch (error) {
            next(error)
        }
    };

})()