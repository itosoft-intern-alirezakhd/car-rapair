import {validationResult} from 'express-validator'

export default (req , res) =>{

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return this.showValidationErrors(res, errors.array())
    }

}