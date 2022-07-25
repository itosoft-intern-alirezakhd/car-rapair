import { Controller } from "../../../../controller.js";
import Role from '../../../../../models/role-model.js'
import {response} from '../../../../../helpers/response.js'

export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {Role}) , 
        (this.helper = {response})
    }
}