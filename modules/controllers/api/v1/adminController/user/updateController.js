import { InitializeController } from "./initializeController.js";

export default new (class UpdateController extends InitializeController{
    
    async updateUser (req, res, next){
        try {
            const {
                provider,
                username,
                name,
                email,
                password,
                active,
                role="basic",
                _id,
                mobile
            } = req.body;
            let update = {};
            if (name) update.name = name;
            if (username) update.username = username;
            if (email) update.email = email;
            if (mobile) update.mobile = mobile;
            if (active !== undefined) update.active = active;
            if (role) {
                const roleObj = await this.model.Role.findOne({role : role});
                update.role = roleObj._id;
            }
            if (provider) update.provider = provider;

            // const userId = req.params.userId;
            if (password) {
                const hashedPassword = await this.helper.hashPassword(password);
                update = {
                    ...update,
                    password: hashedPassword,
                    accessToken: jwt.sign({
                        userId: _id
                    }, process.env.JWT_SECRET, {
                        expiresIn: "1d"
                    })
                };
            }
            if (Object.keys(update).length === 0)
                return this.helper.response(res , null , null , 200 ,{
                    message: "No items selected"
                }) 
            this.model.User.findByIdAndUpdate(_id, update).then(response => {
                let message;
                if (response) message = {
                    success: true,
                    message: 'User has been updated'
                };
                else message = {
                    success: false,
                    message: 'User Not Found!'
                };
                return this.helper.response(res , null , null , 200 ,message) 
            }).catch(error => {
                return this.abort(res, 401 , null , error) 
            });
        } catch (error) {
            next(error)
        }
    };

})()