const Fawn = require('fawn');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental');

Fawn.init(mongoose);

async function getRentals() {
    const rentals = await Rental.find().sort('-dateOut');
    return rentals;
}

async function getRental(id) {
    const rental = await Rental.findById(id);
    return rental;
}

async function createRental(customer, movie) {
    const rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone,
            isGold: customer.isGold,
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate,
        }
    });

    new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        }).run();

    return rental;
}

async function removeRental(rentalId) {
    return await Rental.findByIdAndRemove(rentalId, { useFindAndModify: false });
}

exports.create = createRental;
exports.remove = removeRental;
exports.getAll = getRentals;
exports.get = getRental;
exports.validate = validate;
