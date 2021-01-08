const request = require('supertest');
const { Genre } = require('../../src/models/genre');
const { User } = require('../../src/models/user');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../src/index'); });

    afterEach(async () => {
        server.close();
        await Genre.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' },
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a genre if valid id is given', async () => {
            const genre = await new Genre({ name: "genre" }).save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is given', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        let token;
        let name;

        const createGenre = async (option = { sendName: true }) => {
            if (option.sendName) return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });

            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token);
        };

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });

        it('should return 401 if client is not logged in', async () => {
            token = '';

            const res = await createGenre();

            expect(res.status).toBe(401);
        });

        it('should return 400 if genre name is not given', async () => {
            const res = await createGenre({ sendName: false });

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await createGenre();

            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 characters', async () => {
            name = new Array().join(52);

            const res = await createGenre();

            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await createGenre();

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {
            const res = await createGenre();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});
