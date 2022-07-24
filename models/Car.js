import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'


const CarSchema = new mongoose.Schema({
    faName: {type: String, required: true, trim: true},
    enName: {type: String, required: true, trim: true},
    slug: {type: String, required: true, trim: true},
    logo: {type: String, trim: true},
    description: {type: String, trim: true},
    brands: [{
        faName: {type: String, required: true, trim: true},
        enName: {type: String, required: true, trim: true},
        slug: {type: String, required: true, trim: true},
    }]
});

CarSchema.plugin(uniqueValidator);
const Role = mongoose.model('cars', CarSchema);
export default Role