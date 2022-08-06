import Role from "../../../../../models/role-model.js";
import {
    InitializeController
} from "./initializeController.js";

export default new(class SingleController extends InitializeController {

    async single(req, res, next) {

        try {
            const roleId = req.params.roleId;
            if(!roleId) return this.abort(res , 400 , null, "id is undefined");
            const role = await this.model.Role.findById(roleId).populate('userRef').exec();
            this.helper.response(res, "get single role successfully", null, 200, role)
            if (!role) this.abort(res, 401, null, "Role does not exist")
        } catch (error) {
            next(error)
        }
    };
})()