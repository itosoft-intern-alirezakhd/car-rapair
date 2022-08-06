import User from "../../../../../models/user-model.js";
import { InitializeController } from "./initializeController.js";



export default new (class DestroyController extends InitializeController{
    
    
    
    async deleteCar (req, res)  {
        try {
            const carId = req.params.carId;
            if(!carId) return this.abort(res , 400 , null , "id is undefined")
            const car = await this.model.Car.findById(carId);
            if(!car) return this.abort(res , 404 , null , "car not found")
            const result = await this.model.Car.findByIdAndDelete(carId)
            let users =  await User.find({cars : result._id});
            if(!users) return this.abort(res , 404 , null , "users not found");
            console.log(users.length);
            users.forEach(async (user) => {
                let newArr = user.cars.filter(c =>{
                    console.log(c);
                    console.log(result._id);
                    return c.toString() !== result._id.toString()
                })
                user.cars = newArr;
                console.log(user.cars);
                user.markModified('cars');
                await user.save();
            });

            if (result) return this.helper.response(res , "Deleted car successfully" , null ,  200 ,  result) 
            else return this.abort(res , 404 , null , "_id Not Found!") 
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 404 , null , "_id Not Found!") 
            return this.abort(res , 500 , null , err);
        }
    }
})()
