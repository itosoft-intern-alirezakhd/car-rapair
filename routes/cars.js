import {createRequire} from "module";

const require = createRequire(import.meta.url);
import Car from "../models/Car.js";

const Pagination = body => {
    let page;
    let size;
    if (body.page < 1 || !body.page) page = 0;
    else page = body.page - 1;
    if (body.size < 1 || !body.size) size = 1;
    else size = body.size;
    return {size, page}
};


const addCar = async (req, res, next) => {
    try {
        const filter = req.body
        Car.create(filter).then(result => {
            res.status(200).json({message: "Car insert Successfully.", result})
        }).catch(err => {
            res.status(401).json(err.message)
        })
    } catch (err) {
        res.status(500).json(err.message)
    }
};
const getAll = async (req, res) => {
    try {
        const {size, page} = Pagination(req.body);
        const sort = req.body.sort;
        const filter = req.body;
        delete filter.page;
        delete filter.size;
        delete filter.sort;

        Car.find(filter).skip(size * page).limit(size).then(async cars => {
            const count = await Car.countDocuments();
            res.status(200).json({count, data: cars})
        })

    } catch (err) {
        res.status(500).json(err.message)
    }
}
const updateCar = async (req, res) => {
    try {
        const filter = req.body;
        console.log(filter)
        // if (!filter._id) return res.status(500).json({message: "Car _id not found!", result: null});
        Car.findByIdAndUpdate(filter._id, {...filter}).then(result => {
            if (!result) return res.status(401).json({message: "Car _id not found!", result: null});
            res.status(200).json({message: "Car Update Successfully.", result});
        }).catch(err => {
            if (err.path === '_id') res.status(401).json({message: "Car _id not found!", result: null});
            else res.status(500).json(err.message)
        })

    } catch (err) {
        return res.status(500).json(err.message)
    }
}
const deleteCar = async (req, res) => {
    try {
        const car = Car.findOne({_id: req.body._id})
        Car.findByIdAndDelete(req.body._id).then(result => {
            if (result) return res.status(200).json("Deleted Successfully");
            else return res.status(401).json("_id Not Found!")
        }).catch(err => {

            if (err.path === '_id') return res.status(401).json("_id Not Found!")
        })

    } catch (err) {
        return res.status(500).json(err.message)
    }
}

export {addCar, getAll, updateCar, deleteCar}