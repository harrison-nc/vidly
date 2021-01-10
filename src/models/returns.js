const Joi = require('joi');

const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
}).label('returns').required();

function validateReturn(returns) {
    return schema.validate(returns);
}

module.exports = {
    validate: validateReturn
}
