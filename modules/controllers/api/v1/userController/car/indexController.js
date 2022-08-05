import User from "../../../../../models/user-model.js";
import {
    InitializeController
} from "./initializeController.js";



export default new(class IndexController extends InitializeController {

    async index(req, res, next) {
        try {
            let query = {
                _id: req.user._id
            };
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
                },
                {
                    $lookup: {
                        from: "cars",
                        localField: "cars",
                        foreignField: "_id",
                        as: "cars",
                    },
                },
                {
                    $project: {
                        "_id": 1,
                        "username": 1,
                        "email": 1,
                        "cars" : 1,
                        "name" : 1
                    },
                },
            ];
            const result = await this.helper.index(req, User, queryData, aggregateData, sort);

            if (!result) return this.abort(res, 500, null);
            const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
            return this.helper.response(res, "get roles successfully", null, 200, Transform);
        } catch (err) {
            next(err)
        }
    };



})()