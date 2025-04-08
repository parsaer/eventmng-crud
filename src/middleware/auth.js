import jwt from "jsonwebtoken";

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if(!token) 
    return res.status(403).json({ error: "Unauthorized" })

  try{ 
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch(err) {
    res.status(401).json({ error: "Invalid token "});
  }
};

export default authMiddleWare;