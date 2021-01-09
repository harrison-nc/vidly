const ObjectId = require('mongoose').Types.ObjectId;
const request = require('supertest');

describe('/api/returns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let Rental;

    beforeEach(async () => {
        server = require('../../src/index');
        const model = require('../../src/models/rental');
        Rental = model.Rental;

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
});
