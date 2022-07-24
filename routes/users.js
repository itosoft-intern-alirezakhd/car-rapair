// const User = require('../models/userModel');
import {createRequire} from "module";

const require = createRequire(import.meta.url);

import User from "../models/userModel.js";
import Otp from "../models/otpModels.js";
import Role from "../models/roleModel.js";
// const Role = require('../models/roleModel');
// const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken'
// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt'
// const roles = require('./roles');
import * as roles from './roles.js'
import emailRegex from 'email-regex';
import otpGenerator from 'otp-generator'

const axios = require('axios');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

const Pagination = body => {
    let page;
    let size;
    if (body.page < 1 || !body.page) page = 0;
    else page = body.page - 1;
    if (body.size < 1 || !body.size) size = 1;
    else size = body.size;
    return {size, page}
};

const profile = async (req, res, next) => {
    if (req.body) {
        console.log(req.body);
        const {username, contact, name, email, role} = req.body;
        return res.json({user: req.user})
    } else return res.json({user: req.user})

};
const signUp = async (req, res, next) => {
    try {
        // console.log(res.locals.loggedInUser)
        jwt.verify(req.body.registerToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err && err.message) return res.status(401).json({error: `${err.message}, please login to obtain a new one`});
            // const user = await User.findById(decoded.userId);
            // if (user.accessToken !== accessToken) return res.status(401).json({error: `jwt expired, please login to obtain a new one`});
            // else res.locals.loggedInUser = await User.findById(decoded.userId);
            // next();
            const otp = await Otp.findById(decoded.userId)
            if (!otp) return res.status(400).json({status: false, message: "You use an Expired OTP!"})
            const {name, username, email, password, contact} = req.body;
            const role = "basic"
            if (!emailRegex({exact: true}).test(email)) return res.status(401).json({
                success: false,
                message: "ایمیل با فرمت درست وارد شود"
            })

            let hashedPassword
            if (password) hashedPassword = await hashPassword(password);
            else hashedPassword = "undefined"
            const newUser = new User({
                name,
                // userRef: res.locals.loggedInUser._id,
                username,
                contact,
                email,
                password: hashedPassword,
                active: false,
                mobile: otp.number,
                role: role
            });
            newUser.accessToken = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
                expiresIn: "1d"
            });
            Role.findOne({role: role}).then(result => {
                if (!result) new Role({role}).save()
            })
            await newUser.save(async (err, user) => {
                if (err) {
                    let message = "";
                    if (err.errors.username) message = `${err.errors.username} `;
                    if (err.errors.email) message += `${err.errors.email} `;
                    if (err.errors.password) message += `${err.errors.password}`;
                    if (err.errors.mobile) message += `${err.errors.mobile}`;
                    message = message.trim();
                    return res.status(401).json({
                        success: false,
                        message
                    })
                } else {
                    const OTPDelete = await Otp.deleteMany({number: otp.number})

                    return res.json({
                        success: true,
                        message: "User registrations is successful."
                    })
                }
            });

        });

    } catch (error) {
        next(error)
    }
};
const login = async (req, res, next) => {
    try {
        let {username, expiresIn, password} = req.body;
        let user = await User.findOne({username});
        // if (!user) user = await User.findOne({username});
        // console.log(expiresIn)
        if (!expiresIn) expiresIn = 36000;
        if (!user) return res.status(403).json({message: 'Username does not exist'});
        if (!user.active) return res.status(403).json({message: 'User not activated'});
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return res.status(403).json({message: 'Password is not correct'});
        const accessToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: expiresIn
        });
        User.findByIdAndUpdate(user._id, {accessToken: accessToken}).then(async () => {
            const role = await Role.findOne({role: user.role})
            res.status(200).json({
                status: 200,
                family: "SUCCESSFUL",
                data: accessToken,
                exp: jwt.decode(accessToken).exp,
                profile: {name: user.name, email: user.email},
                permissions: role.permissions,
                // data: {email: user.email, role: user.role},
                // accessToken
            })

        });
    } catch (error) {
        next(error);
    }
};
const loginWithOTP = async (req, res) => {
    try {

        let {number, optionalLoginToken} = req.body;
        const OTP = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        })
        const otp = new Otp({number: number, otp: OTP})
        const salt = await bcrypt.genSalt(10)
        otp.otp = await bcrypt.hash(otp.otp, salt)
        const result = await otp.save()
        console.log(OTP)

        const data = JSON.stringify({
            Code: OTP,
            MobileNumber: number
        });
        const config = {
            method: 'post',
            url: 'https://RestfulSms.com/api/VerificationCode',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };
        axios({
            method: 'post',
            url: 'https://RestfulSms.com/api/Token',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                UserApiKey: "53db357b34e813bc49e9357b",
                SecretKey: "123456789"
            }
        })
            .then(function (response) {
                // console.log(JSON.stringify(response.data));
                config.headers["x-sms-ir-secure-token"] = response.data['TokenKey']
                axios(config)
                    .then(function (response) {
                        // console.log(JSON.stringify(response.data));
                        res.status(200).json({
                            status: response.data.IsSuccessful,
                            message: response.data.Message,
                        })
                    })
                    .catch(function (error) {
                        console.log(error);
                    });

            })
            .catch(function (error) {
                console.log(error);
            });

    } catch (error) {

    }
};
const verifyOTP = async (req, res) => {
    try {
        const optHolder = await Otp.find({number: req.body.number});
        if (optHolder.length === 0) return res.status(400).json({status: false, message: "You use an Expired OTP!"});
        const rightOtpFind = optHolder[optHolder.length - 1];
        const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp)

        if (rightOtpFind.number === req.body.number && validUser) {

            // let {username, expiresIn, password} = req.body;
            let user = await User.findOne({mobile: rightOtpFind.number});
            // if (!user) user = await User.findOne({username});
            // console.log(expiresIn)
            // if (!expiresIn) expiresIn = 36000;
            if (!user) {
                // return res.status(403).json({message: 'Username does not exist'});
                const otp = jwt.sign({userId: rightOtpFind._id}, process.env.JWT_SECRET, {
                    expiresIn: 36000
                });
                Otp.findByIdAndUpdate(rightOtpFind._id, {otp: otp}).then(async () => {
                    // const role = await Role.findOne({role: user.role})
                    // const OTPDelete = await Otp.deleteMany({number: rightOtpFind.number})
                    return res.status(200).json({
                        status: true,
                        register: false,
                        registerToken: otp,
                        // exp: jwt.decode(otp).exp,
                        number: rightOtpFind.number
                        // profile: {name: user.name, email: user.email},
                    })
                });

            } else {
                if (!user.active) return res.status(403).json({message: 'User not activated'});

                // const validPassword = await validatePassword(password, user.password);
                // if (!validPassword) return res.status(403).json({message: 'Password is not correct'});
                const accessToken = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
                    expiresIn: 36000
                });
                User.findByIdAndUpdate(user._id, {accessToken: accessToken}).then(async () => {
                    const role = await Role.findOne({role: user.role})
                    const OTPDelete = await Otp.deleteMany({number: rightOtpFind.number})
                    return res.status(200).json({
                        status: true,
                        register: true,
                        family: "SUCCESSFUL",
                        data: accessToken,
                        exp: jwt.decode(accessToken).exp,
                        profile: {name: user.name, email: user.email},
                        permissions: role.permissions,
                        // data: {email: user.email, role: user.role},
                        // accessToken
                    })
                });
            }
        } else return res.status(400).json({status: false, message: "You use an Expired OTP!"})
    } catch (error) {

    }
};
const whoAmI = async (req, res) => {
    try {
        console.log(res.locals.loggedInUser)
        const data = res.locals.loggedInUser.toObject()
        delete data._id
        delete data.password
        delete data.username
        delete data.userRef
        delete data.accessToken
        delete data.__v
        res.status(200).json(data)

        // User.findByIdAndUpdate(user._id, {accessToken: accessToken}).then(async () => {
        //     const role = await Role.findOne({role: user.role})
        //     res.status(200).json({
        //         status: 200,
        //         family: "SUCCESSFUL",
        //         data: accessToken,
        //         exp: jwt.decode(accessToken).exp,
        //         profile: {name: user.name, email: user.email},
        //         permissions: role.permissions,
        //     })
        //
        // });

    } catch (err) {

    }
}
const getUsers = async (req, res, next) => {
    try {
        const {size, page} = Pagination(req.body);
        const sort = req.body.sort;
        const filter = req.body;
        delete filter.page;
        delete filter.size;
        delete filter.sort;

        User.find(filter).skip(size * page).limit(size).then(results => {
            let users = [];
            for (let result of results) {
                users.push({
                    _id: result._id,
                    name: result.name,
                    username: result.username,
                    email: result.email,
                    contact: result.contact,
                    role: result.role,
                    provider: result.provider,
                    active: result.active,
                })
            }
            res.status(200).json({count: users.length, data: users});
        });
    } catch (err) {

    }
};
const getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        User.findById(userId).then(user => {
            if (!user) res.status(200).json({message: "User does not exist"});
            else res.status(200).json({data: user});
        }).catch(err => {
            res.status(401).json({
                message: "User does not exist"
            });
        });
    } catch (error) {
        next(error)
    }
};
const updateUser = async (req, res, next) => {
    try {
        const {provider, username, name, email, password, active, role, _id, mobile} = req.body;
        let update = {};
        if (name) update.name = name;
        if (username) update.username = username;
        if (email) update.email = email;
        if (mobile) update.mobile = mobile;
        if (active !== undefined) update.active = active;
        if (role) update.role = role;
        if (provider) update.provider = provider;

        // const userId = req.params.userId;
        if (password) {
            const hashedPassword = await hashPassword(password);
            update = {
                ...update,
                password: hashedPassword,
                accessToken: jwt.sign({userId: _id}, process.env.JWT_SECRET, {expiresIn: "1d"})
            };
        }
        if (Object.keys(update).length === 0) return res.status(200).json({message: "No items selected"});
        User.findByIdAndUpdate(_id, update).then(response => {
            console.log(response)
            let message;
            if (response) message = {success: true, message: 'User has been updated'};
            else message = {success: false, message: 'User Not Found!'};
            res.status(200).json(message);
        }).catch(error => {
            return res.json({
                success: false,
                message: error
            })
        });
    } catch (error) {
        next(error)
    }
};
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.body._id;
        if (userId === res.locals.loggedInUser._id.toString()) return res.status(401).json({message: 'Not Access!'})
        User.findByIdAndDelete(userId).then((response) => {
            if (response) return res.status(200).json({message: 'User has been deleted'});
            else return res.status(401).json({message: 'User Not Found!'});
        });
    } catch (error) {
        next(error)
    }
};
const grantAccess = (action, resource) => {
    return async (req, res, next) => {
        try {
            const permission = roles.roles.can(req.user.role)[action](resource);
            if (!permission.granted) {
                return res.status(401).json({
                    error: "You don't have enough permission to perform this action"
                });
            }
            next()
        } catch (error) {
            next(error)
        }
    }
};
const allowIfLoggedIn = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
            return res.status(401).json({
                error: "You need to be logged in to access this route"
            });
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};
const authentication = async (req, res) => {
    try {
        const user = res.locals.loggedInUser;
        if (user) {
            const userObj = {};
            userObj.username = user.username;
            userObj.email = user.email;
            userObj.role = user.role;
            userObj.active = user.active;
            return res.json({success: true, ...userObj})
        } else return res.json({success: false, user: null})
    } catch (error) {
        res.json({error: error.message});
    }
};


export {
    profile,
    signUp,
    login,
    whoAmI,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    grantAccess,
    allowIfLoggedIn,
    authentication,
    loginWithOTP,
    verifyOTP
};