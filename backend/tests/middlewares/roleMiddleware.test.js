const { authorize } = require('../../src/middleware/roleMiddleware');

describe('Role Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('Should authorize avalide role', () => {
    req.user.role = 'admin';
    const middleware = authorize('admin');

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('Should authorize multiple roles', () => {
    req.user.role = 'chauffeur';
    const middleware = authorize('admin', 'chauffeur');

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('Should reject unautaurized role', () => {
    req.user.role = 'chauffeur';
    const middleware = authorize('admin');

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
    expect(next).not.toHaveBeenCalled();
  });
});
