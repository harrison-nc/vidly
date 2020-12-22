const express = require('express');
const { Customer, validate } = require('../models/customer');

const router = express.Router();
router.use(express.json());

async function getCustomers() {
    return await Customer.find().sort('name');
}

async function getCustomer(id) {
    return await Customer.findById(id);
}

async function createCustomer(newCustomer) {
    try {
        const customer = new Customer(newCustomer);
        return await customer.save();
    }
    catch (ex) {
        for (field in ex.errors) {
            console.log('Input Error:', ex.errors[field].message);
        }
        return null;
    }
}

async function updateCustomer(id, customer) {
    return await Customer.findByIdAndUpdate(id, customer, { new: true, useFindAndModify: false });
}

async function removeCustomer(id) {
    return await Customer.findByIdAndRemove(id, { useFindAndModify: false });
}

router.get('/', async (req, res) => {
    const customers = await getCustomers();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await getCustomer(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given id was not found.');

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body.customer);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await createCustomer(req.body.customer);

    if (!customer) return res.status(400).send('The given customer is not valid.');

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body.customer, false);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await updateCustomer(req.params.id, req.body.customer);

    if (!customer) return res.status(404).send('The customer with given id was not found!');

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await removeCustomer(req.params.id);

    if (!customer) return res.status(404).send('The customer with given id was not found!');

    res.send(customer);
});

module.exports = router;
