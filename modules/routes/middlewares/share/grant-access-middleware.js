
import Role from '../../../models/role-model.js';


export default   (action, resource) => {
    return async (req, res, next) => {
        try {
            const user = req.user
            const role = await Role.findOne({userRef : user._id , role : user.role })
            let flag=  false;
            role.permissions.forEach(per => {
                if(per.action === action && per.resource === resource){
                    flag = true
                }
            });
            // const permission =await Role.can(req.user.role)[action](resource);
            if (!flag) {
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