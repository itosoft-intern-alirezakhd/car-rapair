
import {Controller} from '../../../../controller.js'
import axios from '../../../../../helpers/axios.js'
import {hashPassword, validatePassword } from '../../../../../helpers/password.js'
import {configVerify , configToken} from '../../../../../helpers/const.js'
import {response} from '../../../../../helpers/response.js'
import { otpGenerate } from '../../../../../helpers/otp-generator.js' 
import User from '../../../../../models/user-model.js'
import Role from '../../../../../models/role-model.js'
import Otp from '../../../../../models/otp-model.js'


export default class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = {User,Otp , Role}) , 
        (this.helper = {response , axios , validatePassword , hashPassword , otpGenerate  ,configVerify , configToken })
    }
}



