import { Controller } from "../../../../controller.js";
import {response} from '../../../../../helpers/response.js'
import Token from '../../../../../models/token-model.js'
import transform from "../../../../../helpers/transform.js";
import index from "../../../../../helpers/indexAggregate.js";
const itemTransform = ["._id", ".userId", ".liveTime",  ".updatedAt", ".createdAt"];
export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {Token}) , 
        (this.helper = {index , transform , itemTransform,response })
    }
}


