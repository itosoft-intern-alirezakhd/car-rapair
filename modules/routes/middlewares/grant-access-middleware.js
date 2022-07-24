
import Role from '../../models/role-model.js';


export default   (action, resource) => {
    return async (req, res, next) => {
        try {
            const permission =await Role.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
};