import {
    body
} from 'express-validator'


export default [
    body('name', 'name is required')
        .notEmpty(),
    body('model', 'model is required')
        .notEmpty(),
    body('tip', 'tip is required')
        .notEmpty(),
    body('brand', 'brand is required')
        .notEmpty(),
    body('type', 'type is required')
        .notEmpty(),
]