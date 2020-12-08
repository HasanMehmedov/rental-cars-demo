const express = require('express');
const { Customer, validateCustomer } = require('../models/customer');
const auth = require('../middlewares/auth');
const admin = require('../middlewares/admin');
const SYSTEM_ERROR_MESSAGE = 'Something failed.';
const router = express.Router();

router.get('/', async (req, res) => {

    const customers = await getCustomers();
    res.send(customers);
});

router.get('/:id', async (req, res) => {

    const customerId = req.params.id;

    const customer = await getCustomer(customerId);
    res.send(customer);
});

router.post('/', auth, async (req, res) => {

    validateCustomer(req.body);

    const result = await createCustomer(req.body);
    res.send(result);
});

router.put('/:id', auth, async (req, res) => {

    const customerId = req.params.id;
    
    const result = await updateCustomer(customerId, req.body);
    res.send(result);
});

router.delete('/:id', [auth, admin], async (req, res) => {
    
    const customerId = req.params.id;

    const result = await deleteCustomer(customerId);
    res.send(result);
});

async function getCustomers() {

    let customers;
    try {
        customers = await Customer.find();
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    if (!customers || customers.length === 0) {
        const notFoundError = new Error('There are no saved customers.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customers;
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

async function createCustomer(params) {

    const customer = new Customer({
        name: params.name,
        email: params.email,
        phone: params.phone
    });

    let result;
    try {
        result = await customer.save();
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    return result;
}

async function updateCustomer(id, params) {

    const customer = await getCustomer(id);

    if (!params.name) {
        params.name = customer.name;
    }

    if (!params.email) {
        params.email = customer.email;
    }

    if (!params.phone) {
        params.phone = customer.phone;
    }

    validateCustomer(params);

    customer.set({
        name: params.name,
        email: params.email,
        phone: params.phone
    });

    let result;
    try {
        result = await customer.save();
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    return result;
}

async function deleteCustomer(id) {

    const customer = await getCustomer(id);

    try {
        await Customer.deleteOne({ _id: id });
    }
    catch (err) {
        const systemError = new Error(SYSTEM_ERROR_MESSAGE);
        systemError.status = 500;
        throw systemError;
    }

    return customer;
}

module.exports = router;