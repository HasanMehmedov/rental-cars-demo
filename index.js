const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cars = require('./routes/cars');
const home = require('./routes/home');

app.use(express.json());
app.use('/api/cars', cars);
app.use('/', home);

mongoose.connect('mongodb://localhost/cars')
    .then(() => console.log('Succesfully connected to MongoDB...'))
    .catch(() => console.error('Could not connect to the database.'));

const port = process.env.port || 3000;

app.listen(port, () => console.log(`Listening on port ${port}...`));