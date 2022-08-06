import { Controller } from "../../../../controller.js";
import {response} from '../../../../../helpers/response.js'
import Role from '../../../../../models/role-model.js'
import transform from "../../../../../helpers/transform.js";
import index from "../../../../../helpers/indexAggregate.js";
const itemTransform = ["._id", ".role", ".extend" , ".permissions" , ".userRef" , ".user" ];
export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {Role}) , 
        (this.helper = {index , transform , itemTransform,response })
    }
}