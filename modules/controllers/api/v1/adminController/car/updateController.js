import { InitializeController } from "./initializeController.js";



export default new (class UpdateController extends InitializeController{
    
    async updateCar (req, res) {
        try {
            const {name ,logo , model , tip, brand , type} = req.body;
            let carId = req.params.carId;
            if(!carId) return this.abort(res , 400 , null , "carId is undefined")
            let updateCar  = {};
            if(name) updateCar.name = name;
            if(logo) updateCar.logo = logo;
            if(model)  updateCar.model = model;
            if(type)  updateCar.type = type;
            if(tip)  updateCar.tip = tip;
            if(brand)  updateCar.brand = brand;
            if(Object.keys(updateCar).length == 0) 
                return this.abort(res , 400 , null ,"information for updating car is not enough" )  
            const car = await this.model.Car.findById(carId)
            if (!car) return res.status(404).json({message : "this car does not exist "}) 
            await this.model.Car.findByIdAndUpdate(carId, updateCar)
            const result = await this.model.Car.findById(carId);
            if (!result) return this.abort(res , 404 , null ,"Car _id not found!" )  
            this.helper.response(res , "Car Update Successfully." , null ,200 , {adminId : req.user._id , result})
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 404 , null , "Car _id not found!") 
            return res.status(500).json(err)
        }
    }
})()
