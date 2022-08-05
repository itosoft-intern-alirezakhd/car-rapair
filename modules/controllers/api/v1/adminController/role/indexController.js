import {
    InitializeController
} from "./initializeController.js";



export default new(class IndexController extends InitializeController {
    
    async index(req, res, next) {
        try {
            let query = {};
            let sort = {};
            sort = { ...sort, _id: -1 };
            const queryData = [{ $match: query }];
            const aggregateData = [
              { $match: query },
              {
                $lookup: {
                  from: "users",
                  localField: "userRef",
                  foreignField: "_id",
                  as: "userRef",
                },
              },
              {
                $project: {
                  "userRef.username" : 1,
                  "userRef.email" : 1,
                  "userRef.mobile" : 1,
                  "userRef.name" : 1,
                  "role" : 1,
                  "extend" : 1,
                  "permissions" : 1,

                },
              },
            ];
            const result = await this.helper.index(req, this.model.Role, queryData, aggregateData, sort);
            
            if (!result) return this.abort(res, 500, null);
            const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
            return this.helper.response(res, "get roles successfully", null, 200, Transform);
        } catch (err) {
            next(err)
        }
    };



})()