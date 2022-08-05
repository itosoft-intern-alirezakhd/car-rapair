import User from "../../../../../models/user-model.js";
import { InitializeController } from "./initializeController.js";



export default new (class UpdateController extends InitializeController{
    
    async updateCar (req, res) {
        try {
            const {name,logo="logo" , model , tip, brand , type} = req.body;

            let carId = req.params.carId;
            let userId= req.user._id;
            let user = await User.findOne({_id : userId , cars : carId});
            if(!user)   return this.abort(res , 400 , null ,"Car does not exist" )  
            let updateCarId = this.model.Car.findOne({name , model , tip , brand , type }).select("_id"); 
            let index =  user.cars.indexOf(carId);
            user.cars[index] = updateCarId;
            let result = await user.save()
            if (!result) return this.abort(res , 404 , null ,"Car _id not found!" )  
            this.helper.response(res , "Car Update Successfully." , null ,200 , result)
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 404 , null , "Car _id not found!") 
            return res.status(500).json(err)
        }
    }
    
})()
