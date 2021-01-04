module.exports = function (err, req, res, next) {
    // Log error object
    res.status(500).send('Something went wrong.');
}
