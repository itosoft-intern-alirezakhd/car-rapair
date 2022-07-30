import {
    InitializeController
} from '../../basicController/car/initializeController.js'

export default new(class TypeController extends InitializeController {

    async getTypes() {
        try {
            await this.model.Car.find().distinct('types', function (error, typ) {
                if (error) return this.abort(res, 404, null, "not found types")
                this.helper.response(res, "get Types successfully", null, 200, {
                    types: typ
                })
            });
        } catch (err) {
            next(err);
        }
    }


})()