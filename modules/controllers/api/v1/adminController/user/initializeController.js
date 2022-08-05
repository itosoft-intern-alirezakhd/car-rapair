import { Controller } from '../../../../controller.js'
import User from '../../../../../models/user-model.js'
import {hashPassword , validatePassword} from '../../../../../helpers/password.js'
import Pagination from '../../../../../helpers/pagination.js';
import {response} from '../../../../../helpers/response.js'
import transform from '../../../../../helpers/transform.js';
import {index} from '../../../../../helpers/indexAggregate.js'

export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {User}) , 
        (this.helper = {index,transform ,response , hashPassword , validatePassword , Pagination})
    }
}