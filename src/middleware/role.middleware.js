// Middleware for admin
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ status: false, message: 'Access denied. Admins only' });
  };
  
export { isAdmin };