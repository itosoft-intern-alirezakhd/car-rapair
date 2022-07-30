import { InitializeController } from "./initializeController.js";



export default new (class UpdateController extends InitializeController{
    async updateCar (req, res) {
        try {
            const filter = req.body;
            console.log(filter)
            const result = await this.model.Car.findByIdAndUpdate(filter._id, {
                ...filter
            })
            if (!result) return this.abort(res , 401 , logcode ,"Car _id not found!" )  
            this.helper.response(res , null , logcode ,200 ,  {
                message: "Car Update Successfully.",
                result
            })
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 401 , logcode , "Car _id not found!") 
            return res.status(500).json(err.message)
        }
    }
})()
