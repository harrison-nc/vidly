const express = require('express');
const { create, update, remove, getAll, get, validate } = require('../db/customer');

const router = express.Router();
router.use(express.json());

router.get('/', async (req, res) => {
    const customers = await getAll();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await get(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given id was not found.');

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body.customer);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await create(req.body.customer);

    if (!customer) return res.status(400).send('The given customer is not valid.');

    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body.customer, false);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await update(req.params.id, req.body.customer);

    if (!customer) return res.status(404).send('The customer with given id was not found!');

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await remove(req.params.id);

    if (!customer) return res.status(404).send('The customer with given id was not found!');

    res.send(customer);
});

module.exports = router;