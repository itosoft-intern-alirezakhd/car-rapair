import { InitializeController } from "./initializeController.js";



export default new (class UpdateController extends InitializeController{
    async updateCar (req, res) {
        try {
            const {_id ,enName  , faName ,logo="logo" , models , tips, brand , types} = req.body;
            let updateCar  = {};
            if(enName) updateCar.enName = enName;
            if(faName) updateCar.faName = faName;
            if(logo) updateCar.logo = logo;
            if(models)  updateCar.models = models;
            if(types)  updateCar.types = types;
            if(tips)  updateCar.tips = tips;
            if(brand)  updateCar.brand = brand;
            if(Object.keys(updateCar).length == 0) 
                return this.abort(res , 400 , null ,"information for updating car is not enough" )  
            const car = await this.model.Car.findById(_id)
            if (!car) return res.status(404).json({message : "this car does not exist "}) 
            await this.model.Car.findByIdAndUpdate(_id, updateCar)
            const result = await this.model.Car.findById(_id);
            if (!result) return this.abort(res , 404 , null ,"Car _id not found!" )  
            this.helper.response(res , "Car Update Successfully." , null ,200 , result)
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 404 , null , "Car _id not found!") 
            return res.status(500).json(err)
        }
    }


    
})()
