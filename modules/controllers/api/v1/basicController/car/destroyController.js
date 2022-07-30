import { InitializeController } from "./initializeController.js";



export default new (class DestroyController extends InitializeController{
    
    async deleteCar (req, res)  {
        try {
            const carId = req.body.carId;
            const car = await this.model.UserCar.findOne({
                _id: carId
            })
            if(!car) return this.abort(res , 404 , null , "car not found")
            const result = await this.model.UserCar.findByIdAndDelete(carId)
            if (result) return this.helper.response(res , "Deleted car successfully" , null ,  200 ,  result) 
            else return this.abort(res , 404 , null , "_id Not Found!") 
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 404 , null , "_id Not Found!") 
            return this.abort(res , 500 , null , err);
        }
    }
})()
