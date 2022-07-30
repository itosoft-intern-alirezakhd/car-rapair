import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'


const userCarSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    slug: {type: String, trim: true},
    logo: {type: String, trim: true},
    model : {type : String  , required : true, trim : true },
    type : {type : String , required : true  , trim : true},
    tip : {type:String , required : true , trim : true},
    brand: {
        type : String  , required : true , trim : true 
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'user'
    },
    
});

// CarSchema.plugin(uniqueValidator);
const userCar = mongoose.model('userCars', userCarSchema);
export default userCar