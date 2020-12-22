const mongoose = require('mongoose');
const genres = require('./route/genres');
const express = require('express');
const app = express();

async function main() {
    await mongoose.connect('mongodb://localhost/vidly', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    app.use('/api/genres', genres);

    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Listening on port ${port}...`));
}

main();
