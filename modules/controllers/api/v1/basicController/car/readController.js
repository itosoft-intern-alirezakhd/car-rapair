import { InitializeController } from "./initializeController.js";



export default new (class readController extends InitializeController{
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
})()
