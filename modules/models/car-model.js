import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'

const CarSchema = new mongoose.Schema({
    faName: {type: String, required: true , unique : true, trim: true},
    enName: {type: String, required: true, unique : true , trim: true},
    slug: {type: String, trim: true},
    logo: {type: String, trim: true},
    models :[
        {type : String  , required : true, trim : true },
    ],    
    types :[ {type : String , required : true  , trim : true}],
    tips : [{type:String , required : true , trim : true}],
    description: {type: String, trim: true},
    brand: {
        type : String  , required : true , trim : true 
    }
});

CarSchema.plugin(uniqueValidator);
const Car = mongoose.model('cars', CarSchema);
export default Car
