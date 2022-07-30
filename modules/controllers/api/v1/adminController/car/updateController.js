import { InitializeController } from "./initializeController.js";



export default new (class UpdateController extends InitializeController{
    async updateCar (req, res) {
        try {
            const {_id , name,logo="logo" , models , tips, brand , types} = req.body;
            await this.model.Car.findByIdAndUpdate(_id, {
                name , models  , tips , brand , types
            })
            const result = await this.model.Car.findById(_id);
            if (!result) return this.abort(res , 404 , null ,"Car _id not found!" )  
            this.helper.response(res , "Car Update Successfully." , null ,200 , result)
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 404 , null , "Car _id not found!") 
            return res.status(500).json(err)
        }
    }


    
})()
