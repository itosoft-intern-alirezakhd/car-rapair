// const express = require('express');
import express from "express";

const router = express.Router();

// const roleController = require('./roles');
// import './roles.js'
import * as Role from './roles.js'
import * as User from './users.js'
import * as Car from './cars.js'
// const userController = require('./users');
// const fileUpload = require('express-fileupload');


router.post('/auth/signup', User.signUp);
router.post('/auth/login', User.login);
router.post('/auth/loginWithOTP', User.loginWithOTP);
router.post('/auth/verifyOTP', User.verifyOTP);
router.get('/auth/whoAmI', User.allowIfLoggedIn, User.whoAmI);
router.get('/profile', User.allowIfLoggedIn, User.grantAccess('readAny', 'profile'), User.profile);
router.post('/users/getAll', User.allowIfLoggedIn, User.grantAccess('readAny', 'user'), User.getUsers);
router.post('/users/create', User.allowIfLoggedIn, User.grantAccess('createAny', 'user'), User.signUp);
router.put('/users/update', User.allowIfLoggedIn, User.grantAccess('updateAny', 'user'), User.updateUser);
router.delete('/users/delete', User.allowIfLoggedIn, User.grantAccess('deleteAny', 'user'), User.deleteUser);

router.post('/roles/create', User.allowIfLoggedIn, User.grantAccess('createAny', 'role'), Role.addRole);
router.post('/roles/getAll', User.allowIfLoggedIn, User.grantAccess('readAny', 'role'), Role.getRoles);
router.put('/roles/update', User.allowIfLoggedIn, User.grantAccess('updateAny', 'role'), Role.updateRole);
router.delete('/roles/delete', User.allowIfLoggedIn, User.grantAccess('deleteAny', 'role'), Role.deleteRole);
router.get('/roles/distinct', User.allowIfLoggedIn, User.grantAccess('readAny', 'role'), Role.distinct);

router.post('/cars/create', User.allowIfLoggedIn, Car.addCar)
router.post('/cars/getAll', User.allowIfLoggedIn, Car.getAll)
router.put('/cars/update', User.allowIfLoggedIn, Car.updateCar)
router.delete('/cars/delete', User.allowIfLoggedIn, Car.deleteCar)
// Authentication
// router.get('/auth/v1', userController.authentication);


// module.exports = router;
export default router