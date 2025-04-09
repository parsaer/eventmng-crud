
const adminMiddleWare = (req, res, next) => {
  if(!req.user?.isAdmin) {
    return res.status(403).json({error: "Admin access only"});
  }
  next();
};

export default adminMiddleWare;