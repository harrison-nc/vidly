const moment = require('moment');
const ObjectId = require('mongoose').Types.ObjectId;
const request = require('supertest');
const { User } = require('../../src/models/user');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let Rental;
    let movie;
    let Movie;
    let token;

    const returnRental = (payload, token) => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send(payload);
    };

    beforeEach(async () => {
        server = require('../../src/index');
        Rental = require('../../src/models/rental').Rental;
        Movie = require('../../src/models/movie').Movie;

        customerId = new ObjectId();
        movieId = new ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '1234',
            dailyRentalRate: 2,
            numberInStock: 1,
            genre: { name: '12345' }
        });

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '1234',
                phone: '12345',
            },
            movie: {
                _id: movieId,
                title: '1234',
                dailyRentalRate: movie.dailyRentalRate,
            }
        });

        await rental.save();
    });

    afterEach(async () => {
        await Rental.deleteMany({});
        await Movie.deleteMany({});
        await server.close();
    });

    it('should return 401 if client is not logged in', async () => {
        const res = await returnRental({ customerId, movieId }, '')

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        const res = await returnRental({ movieId }, token);

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        const res = await returnRental({ customerId }, token);

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental was found for the customer and movie', async () => {
        await Rental.deleteMany({});

        const res = await returnRental({ customerId, movieId }, token);

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental return is already processed', async () => {
        rental.dateReturned = Date.now();
        await rental.save();

        const res = await returnRental({ customerId, movieId }, token);

        expect(res.status).toBe(400);
    });

    it('should return 200 if request is valid', async () => {
        const res = await returnRental({ customerId, movieId }, token);

        expect(res.status).toBe(200);
    });

    it('should set the return date if input is valid', async () => {
        await returnRental({ customerId, movieId }, token);

        const rentalInDb = await Rental.findById(rental._id);
        const diff = Date.now() - rentalInDb.dateReturned;

        expect(diff).toBeLessThan(40);
    });

    it('should set the rental fee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await returnRental({ customerId, movieId }, token);

        const rentalInDb = await Rental.findById(rental._id);

        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock if input is valid', async () => {
        await returnRental({ customerId, movieId }, token);

        const movieInDb = await Movie.findById(movieId);

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
});
