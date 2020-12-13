const express = require('express');
const { Rental, validateRental } = require('../models/rental');
const { Car } = require('../models/car');
const { Customer } = require('../models/customer');
const auth = require('../middlewares/auth');
const router = express.Router();
const SYSTEM_ERROR_MESSAGE = 'Something failed.';

router.get('/', async (req, res) => {

    const rentals = await getRentals();
    res.send(rentals);
});

router.get('/:id', async (req, res) => {

    const rentalId = req.params.id;

    const rental = await getRental(rentalId);
    res.send(rental);
});

router.post('/', auth, async (req, res) => {

    validateRental(req.body);

    const result = await createRental(req.body);
    res.send(result);
});

async function getRentals() {

    let rentals;
    try {
        rentals = await Rental.find();
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    if (!rentals || rentals.length === 0) {
        const notFoundError = new Error('There are no saved rentals.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return rentals;
}

async function getRental(id) {

    let rental;
    try {
        rental = await Rental.findById(id);
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    if (!rental) {
        const notFoundError = new Error(`Rental with ID: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return rental;
}

async function createRental(params) {
    const customer = await getCustomer(params.customerId);
    const car = await getCar(params.carId);

    const rental = new Rental({
        customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone
        },
        car: {
            name: car.name,
            year: car.year
        }
    });

    let result;
    try {
        result = await rental.save();
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    return result;
}

async function getCustomer(id) {

    let customer;
    try {
        customer = await Customer.findById(id);
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    if (!customer) {
        const notFoundError = new Error(`Customer with ID: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customer;
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
        const notFoundError = new Error(`Car with ID: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return car;
}

module.exports = router;