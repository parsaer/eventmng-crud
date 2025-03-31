import jwt from "jsonwebtoken";

const authMiddleWare = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if(!token) 
    return res.status(401).josn({ error: "Unauthorized" })

  try{ 
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch(err) {
    res.satsu(401).json({ error: "Invalid token "});
  }
};

export default authMiddleWare;