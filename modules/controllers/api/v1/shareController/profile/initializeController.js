import { Controller } from "../../../../controller.js";
import User from '../../../../../models/user-model.js'
import {response}  from '../../../../../helpers/response.js'

export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {User}) , 
        (this.helper = {response})
    }
}