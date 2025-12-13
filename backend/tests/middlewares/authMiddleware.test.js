const { protect } = require('../../src/middleware/authMiddleware');
const User = require('../../src/models/User');
const { generateToken, verifyToken } = require('../../src/utils/jwt');

jest.mock('../src/models/User');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('protect middleware', () => {
    it('Should authorize with a valid token', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const token = generateToken(userId);
      const mockUser = { _id: userId, nom: 'Test', email: 'test@test.com', role: 'chauffeur' };

      req.headers.authorization = `Bearer ${token}`;
      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await protect(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('Should reject without token', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should reject with invalide token', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Token' });
      expect(next).not.toHaveBeenCalled();
    });

    it('Should reject if user not found', async () => {
      const token = generateToken('507f1f77bcf86cd799439011');
      req.headers.authorization = `Bearer ${token}`;

      User.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});

describe('JWT Utils', () => {
  it('Should generate a valid token', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = generateToken(userId);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('Should verify a valid token', () => {
    const userId = '507f1f77bcf86cd799439011';
    const token = generateToken(userId);
    const decoded = verifyToken(token);

    expect(decoded.id).toBe(userId);
  });

  it('Should reject invalide token', () => {
    expect(() => verifyToken('invalid-token')).toThrow();
  });
});
