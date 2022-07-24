import { Controller } from "../../../controller";
import axios from '../../../../helpers/axios'
import {hashPassword, validatePassword } from '../../../../helpers/password'
import {configVerify , configToken} from '../../../../helpers/const'
import response from '../../../../helpers/response'
import Otp from '../models/otpModels'
import User from '../models/userModel'
import Role from '../models/roleModel'


export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {User,Otp , Role}) , 
        (this.helper = {response , axios , validatePassword , hashPassword ,configVerify , configToken })
    }
}



