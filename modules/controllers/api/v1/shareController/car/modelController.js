import { next } from 'cheerio/lib/api/traversing.js'
import {InitializeController} from '../../basicController/car/initializeController.js'

export default new (class  extends InitializeController {

    async getModels (){
        try{
            const  models =await  this.model.Car.find().select('enName models') 
            if(!models) return this.abort(res, 404, null, "not found models")
            this.helper.response(res, "get models successfully", null, 200, models)
        }catch(err){
            next(err)
        }
    }
})()