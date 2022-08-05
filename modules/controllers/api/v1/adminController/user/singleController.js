import Role from "../../../../../models/role-model.js";
import {
    InitializeController
} from "./initializeController.js";

export default new(class SingleController extends InitializeController {

    async single(req, res, next) {
        try {
            const userId = req.params.userId;
            if (!userId) this.abort(res, 400, null, "آیدی را وارد نکرده اید");
            const user = await this.model.User.findOne({
                _id: userId
            })
            if (!user) this.abort(res, 401, null, "User does not exist")
            const roles = await Role.find({
                userRef: user._id
            })
            user.permissions = roles.map((r) => r.permissions);
            return this.helper.response(res, null, null, 200, user);
        } catch (error) {
            next(error)
        }
    };
})()