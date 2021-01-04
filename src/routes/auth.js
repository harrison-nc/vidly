const config = require('config');
const jwt = require('jsonwebtoken');
const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { getByEmail } = require('../db/user');

const router = express.Router();
router.use(express.json());

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await getByEmail(req.body.email);
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
});

const inputSchema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(255).required(),
}).label('auth').required();

function validate(login) {
    return inputSchema.validate(login);
}

module.exports = router;
