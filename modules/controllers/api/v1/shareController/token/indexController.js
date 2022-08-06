import {InitializeController} from './initializeController.js'
export default new (class indexController extends InitializeController {
  async index(req, res) {
    try {
      let query = { userId: req.user._id };
      let sort = {};
      const aggregateData = [
        { $match: query },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "userId",
          },
        },
        {
          $project : {
              "userId.updatedAt": 0,
              "userId.createdAt": 0,
              "userId.__v": 0,
              "userId.password": 0,
          }
        }
      ];
      sort = { ...sort, _id: -1 };
      const queryData = [{ $match: query }];
      const result = await this.helper.index(req,this.model.Token , queryData, aggregateData, sort);
      if (!result) return this.abort(res, 500, logcode);
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true);
      return this.helper.response(res, "get tokens successfully", null, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, null);
    }
  }
})();
