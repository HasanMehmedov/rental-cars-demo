const express = require('express');
const { Car, validateCar } = require('../models/car');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const cars = await getCars();
        res.send(cars);
    }
    catch (err) {
        res.send(err.message);
    }
});

router.get('/:id', async (req, res) => {

    try {
        const carId = req.params.id;
        const car = await getCar(carId);

        res.send(car);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.post('/', auth, async (req, res) => {

    try {
        validateCar(req.body);

        const result = await createCar(req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.put('/:id', auth, async (req, res) => {

    try {
        const carId = req.params.id;

        const result = await updateCar(carId, req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.delete('/:id', [auth, admin], async (req, res) => {

    try {
        const carId = req.params.id;
        const result = await deleteCar(carId);

        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getCars() {

    const cars = await Car.find();
    if (!cars || cars.length === 0) throw new Error(`There are no saved cars.`);

    return cars;
}

async function getCar(id) {

    const car = await Car.findById(id);
    if (!car) {
        const err = new Error(`Car with id: ${id} does not exist.`);
        err.status = 404;
        throw err;
    }

    return car;
}

async function createCar(params) {
    const car = new Car({
        name: params.name,
        year: params.year
    });

    const result = await car.save();
    return result;
}

async function updateCar(id, params) {
    const car = await getCar(id);

    if (!params.name) {
        params.name = car.name;
    }
    if (!params.year) {
        params.year = car.year;
    }

    validateCar(params);

    car.set({
        name: params.name,
        year: params.year
    });

    const result = await car.save();
    return result;
}

async function deleteCar(id) {
    const car = await getCar(id);
    await Car.deleteOne({ _id: id });
    return car;
}

module.exports = router;