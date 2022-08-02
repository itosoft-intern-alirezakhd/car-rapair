import InitializeController from '../../adminController/auth/initializeController.js'
import jwt from 'jsonwebtoken'

export default new(class LogOutController extends InitializeController {

    async logout(req, res, next) {
        try {
            if (req.user) {
                const userId = req.user._id;
                const user = await this.model.User.findById(userId);
                if (!user) return this.helper.abort(res, 404, null, "user not found ");
                res.locals.loggedInUser = null;
                req.user = null;
                user.accessToken = null;
                await user.save();
                return this.ok(res , null , "logout successfully")
            }
            return this.abort(res, 401, null, "user can not access  ");
        } catch (err) {
            next(err)
        }
    }
})()