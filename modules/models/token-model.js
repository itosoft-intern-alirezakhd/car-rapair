const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const timestamps = require("mongoose-timestamp");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

const TokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  token: { type: String },
  liveTime: { type: Date },
//   deviceName: { type: String },
//   lastIp: { type: String },
});
TokenSchema.plugin(timestamps);
TokenSchema.plugin(aggregatePaginate);
const Token = mongoose.model("Token", TokenSchema);
export default Token
