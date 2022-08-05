import { InitializeController } from "./initializeController.js";


export default new (class logoutController extends InitializeController {
  async logout(req, res) {
    req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
    if (this.showValidationErrors(req, res)) return "";
    try {
      let _id = null;
      if (req.query.id) {
        req.checkQuery("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.showValidationErrors(req, res)) return "";
        _id = req.query.id;
      } else {
        _id = req.user.tokenId;
      }
      let query = { _id };
      if (req.user.type != "superAdmin") query = { ...query, userId: req.user._id };
      const token = await this.model.Token.findOne(query).exec();
      if (!token) return this.abort(res, 404, logcode, "ایدی وارد شده صحیح نیست",null,  "id");
      await this.model.Token.findByIdAndRemove(_id).exec();
      return this.ok(res, logcode, "با موفقیت ثبت شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
