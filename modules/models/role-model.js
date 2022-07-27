// const mongoose = require('mongoose');
import mongoose from "mongoose";
// const uniqueValidator = require('mongoose-unique-validator');
import uniqueValidator from 'mongoose-unique-validator'
import User from "./user-model.js";


const RoleSchema = new mongoose.Schema({
    role: {type: String, required: true, unique : true , trim: true},
    // userRef: {type: mongoose.Schema.Types.ObjectId, ref: 'user' , require : true},
    extend: [{type: String}],
    permissions: [{
        resource: {type: String},
        action: {type: String},
        attributes: {type: String, default: '*'},
    }],
});

RoleSchema.pre('remove', async function(next) {
    console.log(this._id);
    try {
            await User.deleteMany({ 'role': this._id });
        next();
    } catch (e) {
        console.log(e);
    }
});

RoleSchema.plugin(uniqueValidator);
const Role = mongoose.model('role', RoleSchema);
// module.exports = Role;
export default Role