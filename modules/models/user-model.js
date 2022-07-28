import mongoose from "mongoose";
import uniqueValidator from 'mongoose-unique-validator'


const UserSchema = new mongoose.Schema({
    name: {type: String},
    // userRef: {type: mongoose.Schema.Types.ObjectId, ref: 'user', null: true},
    provider: {type: String},
    username: {type: String, unique: true, required: true, trim: true},
    mobile: {type: String, unique: true, required: true, trim: true},
    contact: {type: String},
    email: {type: String, required: true, unique: true, trim: true},
    password: {type: String, required: true},
    role: [{
        // type: mongoose.Schema.Types.ObjectId
        // , ref: 'role' 
        type: String, default: 'basic',
        // enum: ["basic", "admin", "superAdmin"]
    }],
    credit: {type: Number}, 
    accessToken: {type: String},
    active: {type: Boolean},
    address: [
        {
            city: {type: String},
            area: {type: String},
            address: {type: String},
            tittle: {type: String},
            lng: {type: Number, trim: true},
            lat: {type: Number, trim: true}
        }
    ],
    transaction: [
        {
            car: {type: mongoose.Schema.Types.ObjectId, ref: 'Car' , required : true},
            payFor: {type: String},
            before: {type: Number},
            pay: {type: Number},
            use: {type: Number},
            after: {type: Number},
            created: {type: Date}
        }
    ]
});


UserSchema.plugin(uniqueValidator);
const User = mongoose.model('user', UserSchema);
// module.exports = User;
export default User