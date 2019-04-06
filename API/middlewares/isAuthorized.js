const jwt = require('jsonwebtoken');

const isAuthorized = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];

  if (token) {
    jwt.verify(token, 'examplesecretword', (err, decoded) => {
      if (err) {
        return res.status(403).json({
          status: 403,
          error: 'FORBIDDEN REQUEST - Wrong Token',
        });
      }
      req.decoded = decoded;
      return next();
    });
  }

  return res.status(403).json({
    status: 200,
    error: 'FORBIDDEN REQUEST - No Token Provided',
  });
};

module.exports = isAuthorized;
