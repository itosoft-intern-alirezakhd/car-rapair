import User from "../../../../../models/user-model.js";
import { InitializeController } from "./initializeController.js";
import { validationResult } from "express-validator";

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
            let user = await User.findById(userId);
            let car = await this.model.Car.findOne({name , model , tip , brand , type});
            console.log(car);
            if(!car){
                return this.abort(res, 401 , null , "car does not exits" );
            }
            user.cars.push(car._id);
            const result  = await user.save();
            if(!result) return this.abort (res, 500 ,null , "insert car error")
            return this.helper.response(res , "Car inserted Successfully." , null ,200 ,  result)
        } catch (err) {
            this.abort(res , 500 , null , err);
        }
    };
})()

