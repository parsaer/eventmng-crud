
const adminMiddleWare = (req, res, next) => {
  console.log(req.user);
  if(!req.user?.isAdmin) {
    return res.status(403).json({error: "Admin access only"});
  }
  next();
};

export default adminMiddleWare;