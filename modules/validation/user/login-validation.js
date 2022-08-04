import {
    body
} from 'express-validator'


export default [
    body('email', 'Email length should not be empty or incorrect format')
        .isEmail().
        notEmpty(),
    body('password', 'Password length should be 5 to 10 charactersand not empty')
        .isLength({
            min: 5,
           max : 10
        })
        .notEmpty(),
]