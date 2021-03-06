const { User } = require('../../../src/models/user');
const auth = require('../../../src/middleware/auth');
const ObjectId = require('mongoose').Types.ObjectId;

describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const user = {
            _id: new ObjectId().toHexString(),
            isAdmin: true
        };
        const token = new User(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token)
        }

        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
        expect(next).toHaveBeenCalled();
    });
});
