import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user" },
  token: { type: String },
  liveTime: { type: Date },
//   deviceName: { type: String },
//   lastIp: { type: String },
});
TokenSchema.plugin(timestamps);
TokenSchema.plugin(aggregatePaginate);
const Token = mongoose.model("Token", TokenSchema);
export default Token
