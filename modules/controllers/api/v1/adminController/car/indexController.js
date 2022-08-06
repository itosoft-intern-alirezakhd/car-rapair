import User from "../../../../../models/user-model.js";
import {
    InitializeController
} from "./initializeController.js";



export default new(class IndexController extends InitializeController {

    async index(req, res, next) {
        try {
            let query = {};
            let sort = {};
            sort = {
                ...sort,
                _id: -1
            };
            const queryData = [{
                $match: query
            }];
            const aggregateData = [{
                    $match: query
                }
            ];
            const result = await this.helper.index(req, this.model.Car, queryData, aggregateData, sort);

            if (!result) return this.abort(res, 500, null);
            const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
            return this.helper.response(res, "get cars successfully", null, 200, Transform);
        } catch (err) {
            next(err)
        }
    };
})()