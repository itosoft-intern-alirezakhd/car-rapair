import User from "../../models/user-model.js";


export default async (req , res, next)=>{
    try{

    let userLogged = res.locals.loggedInUser;
    if(!userLogged) return res.status(401).json({message : "user does not exist"})
    let user = await User.findOne({_id : userLogged._id , role: "superAdmin"});
    if(!user) return res.status(401).json({message : "user does not exist"});
    next();    
    }catch(error){
        next(error);
    }
}