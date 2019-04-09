const isCashier = (req, res, next) => {
  const user = req.decoded;

  if (user.type === 'staff' && user.isAdmin === 'false') {
    next();
  } else {
    res.status(403).json({ status: 403, error: 'FORBIDDEN - Only Cashier can access make this transaction!' });
  }
};

export default isCashier;
