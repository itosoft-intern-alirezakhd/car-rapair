import {
    body
} from 'express-validator'


export default [
    body('role', 'Email should not be empty ')
        .notEmpty()
        .trim(),
    body('permissions', 'permisstions  should not be empty')
        .notEmpty()
        .isArray()
        .trim(),
    body('userId', 'userId should not be empty')
        .notEmpty()
        .trim()


]