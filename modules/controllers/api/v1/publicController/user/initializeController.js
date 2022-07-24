import { Controller } from "../../../controller";
import User from '../../../../models/User'
import {hashPassword , validatePassword} from '../../../../helpers/password'
import Pagination from '../../../../helpers/pagination';
import response from '../../../../helpers/response'

export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {User}) , 
        (this.helper = {response , hashPassword , validatePassword , Pagination})
    }
}