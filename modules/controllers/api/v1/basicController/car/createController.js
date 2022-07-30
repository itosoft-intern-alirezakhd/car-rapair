import { InitializeController } from "./initializeController.js";



export default new (class CreateController extends InitializeController{

    async createCar  (req, res, next)  {
        try {
            const {name,logo="logo" , model , tip, brand , type} = req.body;
            if(!name  || !model || !tip || !brand || !type)
                return this.abort(res , 400 , null , "field can not be empty!" )
            const userId = req.user._id;
            const myCar = this.model.UserCar({
                name,
                logo,
                model,
                type,
                brand,
                tip,
                userId ,
                slug : new Date()
            });
            const result  = await myCar.save();
            if(!result) return this.abort (res, 500 ,null , "insert car error")
            return this.helper.response(res , "Car inserted Successfully." , null ,200 ,  result)
        } catch (err) {
            this.abort(res , 500 , null , err);
        }
    };
})()

