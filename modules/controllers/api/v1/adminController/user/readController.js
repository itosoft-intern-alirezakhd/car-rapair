import { InitializeController } from "./initializeController.js";


export default new (class ReadController extends InitializeController {

    async getUsers  (req, res, next) {

        try {
            const {
                size,
                page
            } = this.helper.Pagination(req.body);
            const sort = req.body.sort;
            const filter = req.body;
            delete filter.page;
            delete filter.size;
            delete filter.sort;
            let results ;

            if(!size  || !page) results = await this.model.User.find()
            else results = await this.model.User.find().skip(size * page).limit(Number.parseInt(size))
            let users = [];
                for (let result of results) {
                    users.push({
                        _id: result._id,
                        name: result.name,
                        username: result.username,
                        email: result.email,
                        contact: result.contact,
                        role: result.role,
                        provider: result.provider,
                        active: result.active,
                    })
                }
                this.helper.response(res , "successfully" , null , 200,{
                    count: users.length,
                    data: users
                })
        } catch (err) {
            next(err)
        }
    };

    async getUser (req, res, next)  {
        try {
            const userId = req.params.userId.toString();
            console.log(userId);
            const user = await this.model.User.findById(userId)
            if (!user) this.abort(res, 401 , null ,"User does not exist" )
            else this.helper.response(res , "successfully get user" , null , 200 , {
                data: user
            }) 
        } catch (error) {
            next(error)
        }
    };

})()