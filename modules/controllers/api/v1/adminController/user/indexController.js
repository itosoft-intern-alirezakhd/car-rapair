import {
    InitializeController
} from "./initializeController.js";
const itemTransform = ["._id", ".email", ".name" , ".username" , ".contact" , ".active" , ".role"];


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
                  from: "roles",
                  localField: "_id",
                  foreignField: "userRef",
                  as: "role",
                },
              },
              {
                $project: {
                  "role.extend": 0,
                  "role.userRef" : 0
                },
              },
            ];
            const result = await this.helper.index(req, this.model.User, queryData, aggregateData, sort);
            if (!result) return this.abort(res, 500, null);
            const Transform = await this.helper.transform(result, itemTransform, true);
            return this.helper.response(res, null, null, 200, Transform);
        } catch (err) {
            next(err)
        }
    };



})()