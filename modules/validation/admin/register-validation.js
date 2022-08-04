import {
    body
} from 'express-validator'


export default [
    body('email', 'Email length should not be empty or incorrect format')
        .isEmail().
        notEmpty(),
    body('name', 'Name length should not be empty')
        .notEmpty(),
    body('username', 'username should not be empty')
        .notEmpty(),
    body('mobile', 'Mobile number should contains 10 digits and not empty')
        .isLength({
            min: 10,
            max: 10
        })
        .notEmpty(),
    body('password', 'Password length should be 5 to 10 charactersand not empty')
        .isLength({
            min: 5,
           max : 10
        })
        .notEmpty(),
    body('role' , 'role should not be empty')
        .notEmpty()


]