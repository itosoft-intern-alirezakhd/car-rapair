import User from "../../../../../models/user-model.js";
import { InitializeController } from "./initializeController.js";



export default new (class UpdateController extends InitializeController{
    
    async updateCar (req, res) {
        try {
            const {name,logo="logo" , model , tip, brand , type} = req.body;
            if(!name || !model || !tip || !brand || !type  ){
                return this.abort(res , 400 , null , "required field should not be empty")
            }
            let carId = req.params.carId;
            if(!carId) return this.abort(res ,400 , null , "carId is undefined")
            let userId= req.user._id;
            let user = await User.findOne({_id : userId , cars : carId});
            if(!user)   return this.abort(res , 400 , null ,"Car does not exist" )  
            let updateCar = await this.model.Car.findOne({name , model , tip , brand , type });
            if(!updateCar)  return this.abort(res , 400 , null ,"Car does not exist" )
            let index =  user.cars.indexOf(carId);
            user.cars[index] = updateCar._id;
            user.markModified('cars');
            let result = await user.save()
            if (!result) return this.abort(res , 404 , null ,"Car _id not found!" )  
            return this.helper.response(res , "Car Update Successfully." , null ,200 , {userId : result._id , updateCar})
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 404 , null , "Car _id not found!") 
            return res.status(500).json(err)
        }
    }
    
})()
