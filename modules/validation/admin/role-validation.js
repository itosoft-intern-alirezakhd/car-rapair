import {
    body
} from 'express-validator'


export default [
    body('role', 'role should not be empty ')
        .notEmpty()
        .trim(),
    body('permissions', 'permisstions  should not be empty or should be array')
        .notEmpty()
        .isArray(),
    body('userId', 'userId should not be empty')
        .notEmpty()
        .trim()


]