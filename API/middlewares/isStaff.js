const isStaff = (req, res, next) => {
  const user = req.decoded;

  if (user.type === 'staff') {
    next();
  } else {
    res.status(403).json({ status: 403, error: 'FORBIDDEN - Only Staff can access make this transaction!' });
  }
};

export default isStaff;
