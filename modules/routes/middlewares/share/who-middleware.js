import User from "../../../models/user-model.js";
import Token from "../../../models/token-model.js";
import {response } from '../../../helpers/response.js'
import transform from "../../../helpers/transform.js"; 
import { Controller } from "../../../controllers/controller.js";
const itemTransform = ["._id", ".name", ".username", ".email", ".mobile", ".role"];
module.exports = async (req, res) => {
  try {
    let controller = new Controller();
    const token = await Token.findOne({ token: req.headers["x-access-token"] }).exec();
    if (!token) return controller.abort(res, 401 , null , "token undefined");
    const user = await User.findById(token.userId).exec();
    if (!user) return controller.abort(res, 401 , null , "user undefined");
    if (token.liveTime < date) {
      await Token.findByIdAndRemove(token._id).exec();
      return controller.abort(res, 401 , null , "token expired");
    } else {
      let values = {};
    
      const hours = Math.abs(token.liveTime - date) / 36e5;
      if (hours <= 1) {
        let liveTime = token.liveTime;
        liveTime.setHours(liveTime.getHours() + 5);
        values = { ...values, liveTime };
      }
    //   if (token.lastIp != req.connection.remoteAddress) values = { ...values, lastIp: req.connection.remoteAddress };
      await Token.findByIdAndUpdate(token._id, values).exec();
      const Transform = await transform(user, itemTransform);
      return response(res, null, logcode, 200, Transform);
    }
  } catch (err) {
    return unauthorized(res, logcode);
  }
};
