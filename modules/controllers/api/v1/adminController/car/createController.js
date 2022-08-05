import { InitializeController } from "./initializeController.js";



export default new (class CreateController extends InitializeController{

    async createCar  (req, res, next)  {
        try {
            const {faName , enName ,logo="logo" , models , tips, brand , types} = req.body;
            const car = this.model.Car({
                faName,
                enName,
                logo,
                models,
                types,
                brand,
                tips,
                slug : new Date()
            });
            const result  = await car.save();
            if(!result) return this.abort (res, 500 ,null , "insert car error")
            return this.helper.response(res , "Car inserted Successfully." , null ,200 ,  result)
        } catch (err) {
            this.abort(res , 500 , null , err);
        }
    };
})()

