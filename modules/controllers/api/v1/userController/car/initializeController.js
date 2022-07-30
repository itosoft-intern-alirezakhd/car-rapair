import { Controller } from "../../../../controller.js";
import UserCar from '../../../../../models/userCar-model.js'
import Car from '../../../../../models/car-model.js'
import User from '../../../../../models/user-model.js'
import Pagination from "../../../../../helpers/pagination.js" 
import {response}  from '../../../../../helpers/response.js'

export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {UserCar , User ,Car}) , 
        (this.helper = {response , Pagination})
    }
}