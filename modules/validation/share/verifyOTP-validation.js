import {
    body
} from 'express-validator'


export default [
    body('number', 'Mobile number should contains 10 digits and not empty')
        .isLength({
            min: 10,
            max: 10
        })
        .notEmpty(),
        body('otp', 'Mobile number should be 6 digit and not empty')
        .isLength({
            min: 6,
            max: 6
        })
        .notEmpty()


]