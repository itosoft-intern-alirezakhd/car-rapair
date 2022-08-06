import {
    InitializeController
} from "./initializeController.js";
import Role from '../../../../../models/role-model.js';
import Token from "../../../../../models/token-model.js";

export default new(class DestroyController extends InitializeController {
    async deleteUser(req, res, next) {
        try {
            const userId = req.params.id;
            if(!userId) this.abort(res , 400 , null , "id is undefined")
            if (userId === req.user._id.toString()) return this.abort(res, 401, null, 'Not Access!')
            let response = await this.model.User.findByIdAndDelete(userId)
            //removing all roles relate to user
            let roles = await Role.find({
                userRef: userId
            });
            roles.forEach(async (role) => {
                await role.remove()
            });
            //removing all tokens relate to user
            let tokens = await Token.find({
                userId: userId
            })
            tokens.forEach(async (token) => {
                await token.remove()
            });
            if (response)
                return this.helper.response(res, 'User has been deleted', null, 200, response)
            return this.abort(res, 401, null, 'User Not Found!')
        } catch (error) {
            next(error)
        }
    };

})()