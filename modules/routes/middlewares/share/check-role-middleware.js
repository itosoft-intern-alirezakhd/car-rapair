import User from "../../../models/user-model.js";
import Role from "../../../models/role-model.js";
import mongoose from "mongoose";

export default  (roles) => {

    return async (req, res, next) => {
        try {
            let userLogged = req.user;
            if (!userLogged) return res.status(401).json({
                message: "user does not exist"
            })
            let user = await User.findOne({
                _id: userLogged._id
            });
            
            const role = await Role.findOne({
                userRef: user._id,
                role: user.role
            })
            if (!role) {
                return res.status(401).json({
                    message: "token is wrong"
                });
            }
            if (roles.length > 1) {
                if (roles[0] === role.role || roles[1] === role.role){
                    next()
                }
                else return res.status(401).json({
                    message: "you have not access this route"
                });
            } else {
                if (role.role === 'superAdmin') {
                    next()
                } else if (role.role === 'admin') {
                    next()
                } else {
                    return res.status(401).json({
                        message: "you have not access this route"
                    });
                }
                next()
            }
        } catch (error) {
            next(error);
        }
    }

}