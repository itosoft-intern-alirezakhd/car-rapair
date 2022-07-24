import { Controller } from "../../../controller";
import Car from '../../../../models/Car'
import Pagination from "../../../../helpers/pagination" 
import response  from '../../../../helpers/response'

export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {Car}) , 
        (this.helper = {response , Pagination})
    }
}