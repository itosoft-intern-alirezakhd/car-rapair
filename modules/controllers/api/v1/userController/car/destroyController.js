import { InitializeController } from "./initializeController.js";

import User from "../../../../../models/user-model.js";

export default new (class DestroyController extends InitializeController{
    
    async deleteCar (req, res)  {
        try {
            const carId = req.params.carId;
            if(!carId) return this.abort(res ,400 , null , "carId is undefined")
            let userId = req.user._id;
            let user =await User.findOne({_id : userId , cars : carId});
            if(!user) {
                return this.abort(res , 400 , null , "user with information does not exist" );
            }
            user.cars =  user.cars.filter(e =>  e !== carId );
            let result = await user.save();
            if (result) return this.helper.response(res , "Deleted car successfully" , null ,  200 ,  result) 
            else return this.abort(res , 404 , null , "_id Not Found!") 
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 404 , null , "_id Not Found!") 
            return this.abort(res , 500 , null , err);
        }
    }
})()
