import jwt from 'jsonwebtoken'
import { InitializeController } from './initializeController.js';


export default new(class CarController extends InitializeController {

    
    async createUser (req , res ,next) {
        jwt.verify(req.body.registerToken, process.env.JWT_SECRET, async (err, decoded) => {
            if (err && err.message)
                return this.abort(res , 401 , null ,`${err.message}, please login to obtain a new one` )
            const otp = await this.model.Otp.findById(decoded.userId)
            if (!otp) return this.abort(res , 400 , null ,"You use an Expired OTP!" ) 

        });
    }

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

            const results = await this.model.User.find(filter).skip(size * page).limit(size)
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
                this.helper.response(res , null , logcode , 200,{
                    count: users.length,
                    data: users
                })
        } catch (err) {
            next(error)
        }
    };
    async getUser (req, res, next)  {
        try {
            const userId = req.params.userId;
            const user = await this.model.User.findById(userId)
            if (!user) this.abort(res, 401 , logcode ,"User does not exist" )
            else this.helper.response(res , null , logcode , 200 , {
                data: user
            }) 
        } catch (error) {
            next(error)
        }
    };
    async updateUser (req, res, next){
        try {
            const {
                provider,
                username,
                name,
                email,
                password,
                active,
                role,
                _id,
                mobile
            } = req.body;
            let update = {};
            if (name) update.name = name;
            if (username) update.username = username;
            if (email) update.email = email;
            if (mobile) update.mobile = mobile;
            if (active !== undefined) update.active = active;
            if (role) update.role = role;
            if (provider) update.provider = provider;

            // const userId = req.params.userId;
            if (password) {
                const hashedPassword = await this.helper.hashPassword(password);
                update = {
                    ...update,
                    password: hashedPassword,
                    accessToken: jwt.sign({
                        userId: _id
                    }, process.env.JWT_SECRET, {
                        expiresIn: "1d"
                    })
                };
            }
            if (Object.keys(update).length === 0)
                return this.helper.response(res , null , logcode , 200 ,{
                    message: "No items selected"
                }) 
            this.model.User.findByIdAndUpdate(_id, update).then(response => {
                console.log(response)
                let message;
                if (response) message = {
                    success: true,
                    message: 'User has been updated'
                };
                else message = {
                    success: false,
                    message: 'User Not Found!'
                };
                this.helper.response(res , null , logcode , 200 ,message) 
            }).catch(error => {
                return this.abort(res, 401 , logcode , error) 
            });
        } catch (error) {
            next(error)
        }
    };

    async deleteUser (req, res, next)  {
        try {
            const userId = req.body._id;
            if (userId === res.locals.loggedInUser._id.toString()) return this.abort(res, 401 , logcode ,'Not Access!' )
            this.model.User.findByIdAndDelete(userId).then((response) => {
                if (response) return this.helper.response(res , null , logcode , {
                    message: 'User has been deleted'
                }) 
                return this.abort(res, 401 , logcode ,'User Not Found!' ) 
            });
        } catch (error) {
            next(error)
        }
    };

    async authentication (req, res) {
        try {
            const user = res.locals.loggedInUser;
            if (user) {
                const userObj = {};
                userObj.username = user.username;
                userObj.email = user.email;
                userObj.role = user.role;
                userObj.active = user.active;
                return res.json({
                    success: true,
                    ...userObj
                })
            } else return res.json({
                success: false,
                user: null
            })
        } catch (error) {
            res.json({
                error: error.message
            });
        }
    };


    async profile  (req, res, next)  {
        if (req.body) {
            console.log(req.body);
            const {
                username,
                contact,
                name,
                email,
                role
            } = req.body;
            return  res.json({
                user: req.user
            })
        } else return res.json({
            user: req.user
        })

    };

})()