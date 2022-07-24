import { Controller } from "../../../controller";
import Role from '../../../../models/Role'
import response from '../../../../helpers/response'

module.exports = class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {Role}) , 
        (this.helper = {response})
    }
}