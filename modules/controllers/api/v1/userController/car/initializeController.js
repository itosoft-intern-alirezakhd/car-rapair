import { Controller } from "../../../../controller.js";
import Car from '../../../../../models/car-model.js'
import {response}  from '../../../../../helpers/response.js'
import index from "../../../../../helpers/indexAggregate.js";
import transform from "../../../../../helpers/transform.js";
const itemTransform = ["._id", ".username", ".email" , ".name" , ".cars"  ];

export class InitializeController extends Controller{
    constructor(){
        super();
        (this.model = { Car}) , 
        (this.helper = { index, transform ,itemTransform , response })
    }
}