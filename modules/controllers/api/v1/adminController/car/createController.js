import Car from "../../../../../models/car-model.js";
import User from "../../../../../models/user-model.js";
import { InitializeController } from "./initializeController.js";
import {validationResult} from 'express-validator'


export default new (class CreateController extends InitializeController{


    async createCar  (req, res, next)  {
        try {
            const {name,logo="logo" , model , tip, brand , type} = req.body;
            //check validation
            let errors  = validationResult(req);
            if(!errors.isEmpty()){
                return this.showValidationErrors(res , errors.array())
            }
            const userId = req.user._id;
            //check existing car
            let existCar = await this.model.Car.findOne({name , model , tip , brand , type })
            if(existCar){
                return this.abort(res , 401 , null , "this car has already exist ");
            }
            let newCar = new Car({
                name ,
                model ,
                tip,
                brand ,
                type,
                logo
            });
            //saving car
            let result = await newCar.save();
            if(!result) return this.abort (res, 500 ,null , "insert car error")
            let user = await User.findById(userId);
            user.cars.push(result._id);
            user.markModified('cars');
            await user.save();
            return this.helper.response(res , "Car inserted Successfully." , null ,200 ,  {userId , result})
        } catch (err) {
            this.abort(res , 500 , null , err);
            
        }
    };

 
})()

