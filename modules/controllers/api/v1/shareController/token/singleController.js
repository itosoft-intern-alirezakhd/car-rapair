import mongoose from "mongoose";
import { InitializeController } from "./initializeController.js";

export default new (class singleController extends InitializeController {
  async single(req, res) {
    try {
      let id = req.params.tokenId
      if(!id) return this.abort(res , 400 , null , "id is undefined");
      let token = await this.model.Token.findById(id).populate('userId' , 'name username mobile email').exec();      
      return this.helper.response(res, "get token successfully", null, 200, token);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, null);
    }
  }
})();
