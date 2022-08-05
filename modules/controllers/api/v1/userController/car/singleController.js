import User from "../../../../../models/user-model.js";
import {
    InitializeController
} from "./initializeController.js";

export default new(class SingleController extends InitializeController {

    async single(req, res)  {
        try {
            const carId = req.params.carId;
            const userId = req.user._id;
            const user = await User.findOne({_id : userId  , cars : carId});
            if(!user) return this.abort(res , 404 , null , "car not found");
            let foundCar = user.cars.find(e => e === carId);
            this.helper.response(res ,"finding car successfully" , null , 200 , foundCar)
        } catch (err) {
            this.abort(res , 500 , null , err);
        }
    }


   
})()