import {
    InitializeController
} from "./initializeController.js";

export default new(class UpdateController extends InitializeController {

    async updateUser(req, res, next) {
        try {
            const {
                provider,
                username,
                name,
                email,
                password,
                active,
                mobile
            } = req.body;
            let userId = req.params.id;
            if (!userId) return this.abort(res, 400, null, "user id is undefined ")
            let update = {};
            if (name) update.name = name;
            if (username) update.username = username;
            if (email) update.email = email;
            if (mobile) update.mobile = mobile;
            if (active) update.active = active;
            if (provider) update.provider = provider;
            // const userId = req.params.userId;
            if (password) {
                const hashedPassword = await this.helper.hashPassword(password);
                update = {
                    ...update,
                    password: hashedPassword
                };
            }
            if (Object.keys(update).length === 0)
                return this.helper.response(res, null, null, 200, {
                    message: "No items selected"
                })
            let response = await this.model.User.findByIdAndUpdate(userId, update);
            let message;
            if (response) message = {
                success: true,
                message: 'User has been updated'
            };
            else message = {
                success: false,
                message: 'User Not Found!'
            };
            let updatedUser = await this.model.User.findById(userId);
            return this.helper.response(res, "update user successfully", null, 200, updatedUser)
                .catch(error => {
                    return this.abort(res, 401, null, error)
                });
        } catch (error) {
            next(error)
        }
    };
})()