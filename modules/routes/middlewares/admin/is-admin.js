import User from "../../../models/user-model.js";
import Token from "../../../models/token-model.js";
import { Controller } from "../../../controllers/controller.js";
export default async (req, res , next) => {
  let controller = new Controller();

  try {
    const token = await Token.findOne({ token: req.headers["x-access-token"] }).exec();
    if (!token) return controller.abort(res, 401 , null , "token undefined");
    const user = await User.findOne({_id : token.userId , role : {$in : ["superAdmin" , "admin"]} }).exec();
    if (!user) return controller.abort(res, 401 , null , "user undefined");
    const date = new Date();
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
      user.tokenId = token._id;
      req.user = user;
      next();
    }
  } catch (err) {
    return controller.abort(res, 401 , null  );
  }
};
