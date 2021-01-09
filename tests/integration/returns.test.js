const ObjectId = require('mongoose').Types.ObjectId;
const request = require('supertest');
const { User } = require('../../src/models/user');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let Rental;

    beforeEach(async () => {
        server = require('../../src/index');
        Rental = require('../../src/models/rental').Rental;

        customerId = new ObjectId();
        movieId = new ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '1234',
                phone: '12345',
            },
            movie: {
                _id: movieId,
                title: '1234',
                dailyRentalRate: 2,
            }
        });

        await rental.save();
    });

    afterEach(async () => {
        await Rental.deleteMany({});
        await server.close();
    });

    it('should return 401 if client is not logged in', async () => {
        const res = await request(server)
            .post('/api/returns')
            .send({ customerId, movieId });

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ movieId });

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId });

        expect(res.status).toBe(400);
    });
});
