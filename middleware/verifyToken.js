import jwt from "jsonwebtoken"
export function verifyToken(req,res,next){
    const authHeader = req.headers["authorization"];
// Header check
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }
  // Bearer <token> split
  const token=authHeader.split(" ")[1];
 if(!token){
    return res.status(401).json({mess:"token missing"});
 }
//  verify token
jwt.verify(token.process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
// Save user info from token to request object
    req.user = decoded;
    next();
  });



}