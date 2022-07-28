import { InitializeController } from "./initializeController.js";


export default new (class updateController extends InitializeController{

    async distinct (req, res)  {
        try {
            this.model.Role.distinct('role').then(result => {
                return this.helper.response(res, null , null , 200 ,result ) 
            })
        } catch (error) {
            next(error)
        }
    };

})()