const request = require('supertest');
const { Genre } = require('../../src/models/genre');
const { User } = require('../../src/models/user');
const ObjectId = require('mongoose').Types.ObjectId;
let server;

describe('/api/genres', () => {
    beforeAll(() => { server = require('../../src/index'); });

    afterAll(async () => { await server.close(); });

    afterEach(async () => { await Genre.deleteMany({}); });

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
        it('should return a genre if the given id is valid', async () => {
            const genre = await new Genre({ name: "genre" }).save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if an invalid id is given', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 if a genre with the given id was not found', async () => {
            const id = new ObjectId();
            const res = await request(server).get('/api/genres/' + id);
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

    describe('PUT /api/genres/:id', () => {
        let token;
        let name;
        let genreId;

        const updateGenre = () => {
            return request(server)
                .put('/api/genres/' + genreId)
                .set('x-auth-token', token)
                .send({ name });
        };

        beforeEach(async () => {
            name = 'genre1'
            const genre = await new Genre({ name }).save();
            genreId = genre._id;
            token = new User().generateAuthToken();
        });

        it('should return 401 if token is not given', async () => {
            token = '';

            const res = await updateGenre();

            expect(res.status).toBe(401);
        });

        it('should return 400 if token is invalid', async () => {
            token = 'a';

            const res = await updateGenre();

            expect(res.status).toBe(400);
        });

        it('should return 200 if token is valid', async () => {
            const res = await updateGenre();

            expect(res.status).toBe(200);
        });

        it('should return 404 if genreId is invalid', async () => {
            genreId = 'a';

            const res = await updateGenre();

            expect(res.status).toBe(404);
        });

        it('should return 404 if genre is not found', async () => {
            genreId = new ObjectId().toHexString();

            const res = await updateGenre();

            expect(res.status).toBe(404);
        });

        it('should return 400 if name length is less than 5', async () => {
            name = '1234';

            const res = await updateGenre();

            expect(res.status).toBe(400);
        });

        it('should return 400 if name length is more than 50', async () => {
            name = new Array(52).join('a');

            const res = await updateGenre();

            expect(res.status).toBe(400);
        });

        it('should update the genre if it is valid and user is authenticated', async () => {
            name = 'new name';

            await updateGenre();

            const result = await Genre.findOne({ name }).select('_id name');

            expect(result).toBeDefined();
            expect(result).toMatchObject({ _id: genreId, name: name });
        });

        it('should return the genre if it is valid', async () => {
            name = 'new name';

            const res = await updateGenre();

            expect(res.body).toBeDefined();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        });
    });
});
