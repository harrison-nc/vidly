const { Rental, validate } = require('../models/rental');

async function getRentals() {
    const rentals = await Rental.find().sort('customer.name');
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
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            genre: {
                name: movie.genre.name,
            }
        }
    });

    return await rental.save();
}

async function removeRental(rentalId) {
    return await Rental.findByIdAndRemove(rentalId, { useFindAndModify: false });
}

exports.create = createRental;
exports.remove = removeRental;
exports.getAll = getRentals;
exports.get = getRental;
exports.validate = validate;
