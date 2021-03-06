const moment = require('moment');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const { Movie } = require('../models/movie');
const { Rental, validate } = require('../models/rental');

const Task = Fawn.Task;

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

    const task = new Task()
        .save('rentals', rental)
        .update('movies', { _id: movie._id }, {
            $inc: { numberInStock: -1 }
        });

    await task.run();

    return rental;
}

async function removeRental(rentalId) {
    return await Rental.findByIdAndRemove(rentalId, { useFindAndModify: false });
}

function lookup(customerId, movieId) {
    return Rental.findOne({
        'customer._id': customerId,
        'movie._id': movieId,
    });
}

async function returnRental(rental) {
    rental.dateReturned = Date.now();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    const updatedRental = await rental.save();

    const movie = await Movie.findByIdAndUpdate(rental.movie._id, {
        $inc: { numberInStock: 1 }
    });

    await movie.save();

    return updatedRental;
}


exports.create = createRental;
exports.remove = removeRental;
exports.getAll = getRentals;
exports.get = getRental;
exports.lookup = lookup;
exports.returnRental = returnRental;
exports.validate = validate;
