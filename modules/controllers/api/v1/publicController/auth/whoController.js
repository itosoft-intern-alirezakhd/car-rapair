import  InitializeController  from "./initializeController.js"

export default new(class WhoController extends InitializeController {

    async whoAmI  (req, res,next)  {
        try {
            console.log(res.locals.loggedInUser)
            const data = res.locals.loggedInUser.toObject()
            delete data._id
            delete data.password
            delete data.username
            delete data.userRef
            delete data.accessToken
            delete data.__v
            return this.helper.response(res , null , logcode , 200  , data)
        } catch (err) {
            next(error);
        }
    }
})()