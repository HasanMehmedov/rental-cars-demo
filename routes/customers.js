const express = require('express');
const { Customer, validateCustomer } = require('../models/customer');
const router = express.Router();

router.get('/', async (req, res) => {

    try {
        const customers = await getCustomers();
        res.send(customers);
    }
    catch (err) {
        res.status(err.status).send(err.message);
    }
});

async function getCustomers(){
    const customers = await Customer.find();

    if(!customers || customers.length === 0){
        const notFoundError = new Error('There are no saved customers.');
        notFoundError.status = 404;
        throw notFoundError;
    }

    return customers;
}

module.exports = router;