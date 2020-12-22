const { Customer, validate } = require('../models/customer');

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

exports.create = createCustomer;
exports.update = updateCustomer;
exports.remove = removeCustomer;
exports.getAll = getCustomers;
exports.get = getCustomer;
exports.validate = validate;
