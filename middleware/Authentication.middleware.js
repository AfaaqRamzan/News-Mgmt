import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  // * Check the request headers have the authorization header
  let authHeader = req.headers.authorization;
  if (
    !authHeader ||
    authHeader === null ||
    authHeader === undefined ||
    authHeader === "" ||
    !authHeader.startsWith("Bearer ")
  ) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  // * Get the token from the auth header
  let token = authHeader.split(" ")[1];

  //   * Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ status: 401, message: "UnAuthorized" });
    }
    req.user = user;
    next();
  });
};

export default authMiddleware;
