import { InitializeController } from "./initializeController";


export default new(class CarController extends InitializeController {

    async addCar  (req, res, next)  {
        try {
            const filter = req.body;
            
            this.model.Car.create(filter).then(result => {
                this.helper.response(res , null , logcode , 200 , {
                    message: "Car insert Successfully.",
                    result
                })
            }).catch(err => {
                this.abort(res , 401 , logcode , err.message);
            })
        } catch (err) {
            this.abort(res , 500 , logcode , err.message);
        }
    };

    async getAll(req, res)  {
        try {
            const {size,page} = this.helper.Pagination(req.body);
            const sort = req.body.sort;
            const filter = req.body;
            delete filter.page;
            delete filter.size;
            delete filter.sort;

            const cars = await this.model.Car.find(filter).skip(size * page).limit(size)
            const count = await this.model.Car.countDocuments();
            this.helper.response(res , null , logcode , 200 ,  {
                count,
                data: cars
            })
        } catch (err) {
            this.abort(res , 500 , logcode , err.message);
        }
    }


    
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
    async deleteCar (req, res)  {
        try {
            await this.model.Car.findOne({
                _id: req.body._id
            })
            const result = await this.model.Car.findByIdAndDelete(req.body._id)
            if (result) return this.helper.response(res , null , logcode ,  200 ,  "Deleted Successfully") 
            else return this.abort(res , 401 , logcode , "_id Not Found!") 
        } catch (err) {
            if (err.path === '_id') return this.abort(res , 401 , logcode , "_id Not Found!") 
            return this.abort(res , 500 , logcode , err.message);
        }
    }
})()