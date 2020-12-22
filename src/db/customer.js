const { Customer, validate } = require('../models/customer');

async function getCustomers() {
    return await Customer.find().sort('name');
}

async function getCustomer(id) {
    return await Customer.findById(id);
}

async function createCustomer(customer) {
    const newCustomer = new Customer({
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
    });
    return await newCustomer.save();
}

async function updateCustomer(id, customer) {
    return await Customer.findByIdAndUpdate(id, {
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
    }, { new: true, useFindAndModify: false });
}

async function removeCustomer(id) {
    return await Customer.findByIdAndRemove(id, { useFindAndModify: false });
}

exports.create = createCustomer;
exports.update = updateCustomer;
exports.remove = removeCustomer;
exports.getAll = getCustomers;
exports.get = getCustomer;
exports.validate = validate;
