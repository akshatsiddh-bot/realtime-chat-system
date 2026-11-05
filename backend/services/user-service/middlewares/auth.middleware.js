import jwt from "jsonwentoken"
import logger from "../config/logger.js"

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        logger.error("Unauthorized: Token missing");
      return res.status(401).json({
        message: "Unauthorized: Token missing",
        success: false,
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.userId = decoded.id;

    next();

  } catch (error) {
    logger.error("Unauthorized: Invalid or expired token");
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};

export default authMiddleware;