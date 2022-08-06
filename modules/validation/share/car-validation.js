import {
    body
} from 'express-validator'


export default [
    body('name', 'name is required')
        .notEmpty()
        .trim(),
    body('model', 'model is required')
        .notEmpty()
        .isNumeric()
        ,
    body('tip', 'tip is required')
        .notEmpty()
        .trim(),
    body('brand', 'brand is required')
        .notEmpty()
        .trim(),
    body('type', 'type is required')
        .notEmpty()
        .trim(),
]