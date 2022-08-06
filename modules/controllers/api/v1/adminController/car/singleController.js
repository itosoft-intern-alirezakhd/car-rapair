import User from "../../../../../models/user-model.js";
import {
    InitializeController
} from "./initializeController.js";

export default new(class SingleController extends InitializeController {

    async single(req, res  ,next)  {
        try {
            const carId = req.params.carId;
            if(!carId) return this.abort(res , 400 , null , "carId is undeifned")
            const car = await this.model.Car.findOne({_id : carId})
            if(!car) return this.abort(res , 404 , null , "car not found");
            this.helper.response(res ,"finding car successfully" , null , 200 , {adminId : req.user._id , car})
        } catch (err) {
            this.abort(res , 500 , null , err);
        }
    }
})()