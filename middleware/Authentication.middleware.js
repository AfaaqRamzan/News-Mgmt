import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  // * Check the request headers have the authorization header
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  // * Extract the token safely from the header string
  let token = authHeader.split(" ")[1] || authHeader;

  // Remove accidental double quotes, single quotes, or extra spaces
  token = token.replace(/['"]+/g, "").trim();

  // Debug log (check your terminal when you hit Execute in Swagger)
  // console.log("Token received:", token);
  // console.log("JWT_SECRET loaded:", Boolean(process.env.JWT_SECRET));

  //   * Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err.message);
      return res.status(401).json({ status: 401, message: "UnAuthorized" });
    }
    req.user = user;
    next();
  });
};

export default authMiddleware;
