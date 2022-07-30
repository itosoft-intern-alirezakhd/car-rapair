import {InitializeController} from '../../userController/car/initializeController.js'

export default new (class TypeController extends InitializeController {

    async getTips(req , res , next){
        try{
            const  tips =await  this.model.Car.find().select('enName tips') 
            if(!tips) return this.abort(res, 404, null, "not found tips")
            this.helper.response(res, "get tips successfully", null, 200, tips)
        }catch(err){
            next(err)
        }


    }


})()