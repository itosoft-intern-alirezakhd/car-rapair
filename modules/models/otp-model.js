// import {createRequire} from "module";
// const require = createRequire(import.meta.url);
// const {Schema, model} = require("mongoose");
import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    number: {
        type: String,
        require: true
    },
    otp: {
        type: String,
        require: true
    },
    // accessToken: {type: String},
    createAt: {type: Date, default: Date.now(), index: {expire: 300}},
    userId : {
        type: mongoose.Schema.Types.ObjectId,
         ref: 'user' 
    }
    // After 5 minutes it deleted automatically from the database
}, { timestamps: true})
const Otp = mongoose.model("Otp",  OtpSchema)

export default Otp