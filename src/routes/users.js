const _ = require('lodash');
const express = require('express');
const { create, validate, getByEmail } = require('../db/user');

const router = new express.Router();
router.use(express.json());

router.post('/', async (req, res) => {
    const value = req.body.user;
    const { error } = validate(value);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await getByEmail(value.email);
    if (user) return res.status(400).send('User already registered.');

    if (value.password !== value.passwordAgain)
        return res.status(400).send('Password mismatch.');

    user = await create(value);
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
