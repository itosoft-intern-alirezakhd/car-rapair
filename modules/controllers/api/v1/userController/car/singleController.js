import User from "../../../../../models/user-model.js";
import {
    InitializeController
} from "./initializeController.js";

export default new(class SingleController extends InitializeController {

    async single(req, res) {

        try {
            const carId = req.params.carId;
            if(!carId) return this.abort(res ,400 , null , "carId is undefined")
            const userId = req.user._id;
            const car = await this.model.Car.findById(carId);
            if (!car) return this.abort(res, 404, null, "car not found");
            this.helper.response(res, "finding car successfully", null, 200, {
                userId,
                car
            })
        } catch (err) {
            this.abort(res, 500, null, err);
        }

    }



})()