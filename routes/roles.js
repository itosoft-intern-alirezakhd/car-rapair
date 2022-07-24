// const AccessControl = require("accesscontrol");
import {AccessControl} from "accesscontrol";
// const Role = require('../models/roleModel');
import Role from "../models/roleModel.js";

const getGrants = function () {
    let grantList = [];
    Role.find({}).then(async roless => {
        roless.forEach(role => {
            role.permissions.forEach(perms => {
                grantList.push({
                    role: role.role,
                    extend: role["extend"],
                    resource: perms.resource,
                    action: perms.action,
                    attributes: perms.attributes,
                })
            })
        });
        // new AccessControl(grantList)
        roles = new AccessControl(grantList)
        return roles
    });
};
let roles = () => {}
await getGrants();

const addRole = async (req, res, next) => {
    try {
        const {role, extend, permissions} = req.body;

        const newRole = new Role({role, userRef: res.locals.loggedInUser._id, extend, permissions});
        newRole.save().then(role => {
            res.status(200).json({
                success: true,
                message: 'Role Add successfully'
            });
            getGrants();
        }).catch(err => {
            res.status(400).json(err.message)
        });
    } catch (err) {
        next(err.message);
    }
};
const getRoles = async (req, res, next) => {
    const roles = await Role.find({});
    res.status(200).json({
        data: roles
    });
};
const getRole = async (req, res, next) => {
    try {
        const roleId = req.params.roleId;
        Role.findById(roleId).then(role => {
            res.status(200).json({
                data: role
            });
        }).catch(err => {
            res.status(401).json({
                message: "Role does not exist"
            });
        });
    } catch (error) {
        next(error)
    }
};
const updateRole = async (req, res, next) => {
    try {
        const update = req.body;
        const roleId = req.body._id;
        console.log(roleId)
        Role.findByIdAndUpdate(roleId, update).then(async result => {
            const role = await Role.findById(roleId);
            console.log(role)
            res.status(200).json({
                success: true,
                message: 'Role has been updated'
            });
            getGrants();
        }).catch(error => {
            res.status(500).json(error.message)
        });
    } catch (error) {
        next(error)
    }
};
const deleteRole = async (req, res, next) => {
    try {
        const roleId = req.body._id;
        await Role.findByIdAndDelete(roleId);
        res.status(200).json({
            data: null,
            message: 'Role has been deleted'
        });
        getGrants();
    } catch (error) {
        next(error)
    }
};
const distinct = async (req, res) => {
    try {
        Role.distinct('role').then(result => {
            return res.status(200).json(result);
        })
    } catch (error) {
    }
};

export {
    addRole,
    getRoles,
    getRole,
    updateRole,
    deleteRole,
    distinct,
    roles
};