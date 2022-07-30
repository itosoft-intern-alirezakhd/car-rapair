import Car from "../../models/car-model.js";

export default (state) => {

    return async (req, res, next) => {
        const {
            _id,
            name,
            model,
            tip,
            brand,
            type
        } = req.body;

        if ((state === "update" && (!_id || !name || !model || !tip || !brand || !type)) ||
            (state === "create" && (!name || !model || !tip || !brand || !type))
        )  return res.status(404).json({message : "this car does not exist "})
        const car = await Car.findOne({
            enName: name,
            models : model ,
            types : type ,
            tips : tip ,
            brand : brand 
        })
        if (!car) return res.status(404).json({message : "this car does not exist "}) 
        
     
        next();
    }

}