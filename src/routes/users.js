const express = require('express');
const { create, validate } = require('../db/user');

const router = new express.Router();
router.use(express.json());

router.post('/', async (req, res) => {
    const value = req.body.user;
    const { error } = validate(value);
    if (error) return res.status(400).send(error.details[0].message);

    if (value.password !== value.passwordAgain)
        return res.status(400).send('Password mismatch.');

    const user = await create(value);
    res.send(user);
});

module.exports = router;
