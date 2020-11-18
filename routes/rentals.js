const express = require('express');
const { Rental, validateRental } = require('../models/rental');
const { Car } = require('../models/car');
const { Customer } = require('../models/customer');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const rentals = await getRentals();
        res.send(rentals);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.get('/:id', async (req, res) => {
    const rentalId = req.params.id;

    try {
        const rental = await getRental(rentalId);
        res.send(rental);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

router.post('/', async (req, res) => {
    try {
        validateRental(req.body);

        const result = await createRental(req.body);
        res.send(result);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getRentals() {
    const rentals = await Rental.find();

    if (!rentals || rentals.length === 0) {
        const notFoundError = new Error('There are no saved rentals.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return rentals;
}

async function getRental(id) {
    const rental = await Rental.findById(id);

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

    const result = await rental.save();
    return result;
}

async function getCustomer(id) {
    const customer = await Customer.findById(id);
    if (!customer) {
        const notFoundError = new Error(`Customer with ID: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customer;
}

async function getCar(id) {
    const car = await Car.findById(id);
    if (!car) {
        const notFoundError = new Error(`Car with ID: ${id} was not found.`);
        notFoundError.status = 404;
        throw notFoundError;
    }

    return car;
}

module.exports = router;