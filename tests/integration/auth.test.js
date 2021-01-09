const { Genre } = require('../../src/models/genre');
const { User } = require('../../src/models/user');
const request = require('supertest');

describe('auth middleware', () => {
    let server;
    let token;

    beforeEach(() => {
        server = require('../../src/index');
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await Genre.deleteMany({});
        await server.close();
    });

    const authenticateUser = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    };

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await authenticateUser();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await authenticateUser();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await authenticateUser();

        expect(res.status).toBe(200);
    });
});
