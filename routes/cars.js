const express = require('express');
const { Car, validateCar } = require('../models/car');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const router = express.Router();
const SYSTEM_ERROR_MESSAGE = 'Something failed.';

router.get('/', async (req, res) => {

    const cars = await getCars();
    res.send(cars);
});

router.get('/:id', async (req, res) => {

    const carId = req.params.id;
    const car = await getCar(carId);

    res.send(car);
});

router.post('/', auth, async (req, res) => {

    validateCar(req.body);

    const result = await createCar(req.body);
    res.send(result);
});

router.put('/:id', auth, async (req, res) => {

    const carId = req.params.id;

    const result = await updateCar(carId, req.body);
    res.send(result);
});

router.delete('/:id', [auth, admin], async (req, res) => {

    const carId = req.params.id;
    const result = await deleteCar(carId);

    res.send(result);
});

async function getCars() {
    let cars;

    try {
        cars = await Car.find();
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    if (!cars || cars.length === 0) {
        const notFoundError = new Error('There are no saved cars.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return cars;
}

async function getCar(id) {
    let car;

    try {
        car = await Car.findById(id);
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

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

    let result;
    try {
        result = await car.save();
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

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

    let result;

    try {
        result = await car.save();
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    return result;
}

async function deleteCar(id) {
    const car = await getCar(id);

    try {
        await Car.deleteOne({ _id: id });
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    return car;
}

module.exports = router;