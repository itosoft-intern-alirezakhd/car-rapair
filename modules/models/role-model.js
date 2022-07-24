// const mongoose = require('mongoose');
import mongoose from "mongoose";
// const uniqueValidator = require('mongoose-unique-validator');
import uniqueValidator from 'mongoose-unique-validator'


const RoleSchema = new mongoose.Schema({
    role: {type: String, required: true, trim: true},
    userRef: {type: mongoose.Schema.Types.ObjectId, ref: 'user' , require : true},
    extend: [{type: String}],
    permissions: [{
        resource: {type: String, required: true},
        action: {type: String, required: true},
        attributes: {type: String, default: '*'},
    }],
});

RoleSchema.plugin(uniqueValidator);
const Role = mongoose.model('role', RoleSchema);
// module.exports = Role;
module.exports = Role;