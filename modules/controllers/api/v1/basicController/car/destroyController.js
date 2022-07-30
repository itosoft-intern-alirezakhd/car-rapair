import { InitializeController } from "./initializeController.js";



export default new (class DestroyController extends InitializeController{
    async deleteCar (req, res)  {
        try {
            const carId = req.body.carId;
            const car = await this.model.UserCar.findOne({
                _id: carId , userId : req.user._id
            })
            
            const result = await this.model.Car.findByIdAndDelete(req.body._id)
            if (result) return this.helper.response(res , "Deleted car successfully" , null ,  200 ,  result) 
            else return this.abort(res , 401 , null , "_id Not Found!") 
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 401 , null , "_id Not Found!") 
            return this.abort(res , 500 , null , err);
        }
    }
})()
