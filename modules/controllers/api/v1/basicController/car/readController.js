import { InitializeController } from "./initializeController.js";



export default new (class readController extends InitializeController{
    async getAll(req, res)  {
        try {
            let {size , page }= {};
            if(!req.body.page || !req.body.size ) {
                size = 2;
                page = 0;
            }else {
                {size , page }   this.helper.Pagination(req.body);
            }     
            // const sort = req.body.sort;
            // delete filter.page;
            // delete filter.size;
            // delete filter.sort;
            const userId = req.user._id;

            const cars = await this.model.UserCar.find({userId}).skip(size * page).limit(Number.parseInt(size))
            const count = await this.model.UserCar.countDocuments();
            this.helper.response(res ,"finding car successfully" , null , 200 ,  {
                count,
                cars: cars
            })
        } catch (err) {
            this.abort(res , 500 , null , err.message);
        }
    }


    async getCar(req, res)  {
        try {
            const carId = req.params.carId;
            const car = await this.model.UserCar.findOne({_id : carId})
            if(!car) return this.abort(res , 404 , null , "car not found");
            this.helper.response(res ,"finding car successfully" , null , 200 , car)
        } catch (err) {
            this.abort(res , 500 , null , err);
        }
    }
})()
