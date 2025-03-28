// const jwt = require("jsonwebtoken");
// const { z } = require("zod");

// const clientMiddleware = async (req, res, next) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "");
//   if (!token) return res.status(401).json({ error: "No token provided" });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_KEY);
//     if (decoded.role !== "client") throw new Error("Invalid role");
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "Invalid token" });
//   }
// };

// const validate = (schema) => async (req, res, next) => {
//   try {
//     const parsedBody = await schema.parseAsync(req.body);
//     req.body = parsedBody;
//     next();
//   } catch (error) {
//     const status = 422;
//     const message = "Fill the input properly";
//     const extraDetails = error.errors?.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ") || "Validation error";
//     res.status(status).json({ status, message, extraDetails });
//   }
// };

// const errorMiddleware = (err, req, res, next) => {
//   console.error("Error:", err);
//   const status = err.status || 500;
//   const message = err.message || "Internal Server Error";
//   const extraDetails = err.extraDetails || "An error occurred.";
//   res.status(status).json({ status, message, extraDetails });
// };

// module.exports = { clientMiddleware, validate, errorMiddleware };

const jwt = require("jsonwebtoken");
const { z } = require("zod");

// Middleware allowing both "client" and "landlord" roles (shared)
const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (!["landlord", "client"].includes(decoded.role)) {
      throw new Error("Invalid role");
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware restricting access to "client" role only
const clientOnlyMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    if (decoded.role !== "client") {
      throw new Error("Invalid role");
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Validation middleware (unchanged)
const validate = (schema) => async (req, res, next) => {
  try {
    const parsedBody = await schema.parseAsync(req.body);
    req.body = parsedBody;
    next();
  } catch (error) {
    const status = 422;
    const message = "Fill the input properly";
    const extraDetails = error.errors?.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ") || "Validation error";
    res.status(status).json({ status, message, extraDetails });
  }
};

// Error middleware (unchanged)
const errorMiddleware = (err, req, res, next) => {
  console.error("Error:", err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  const extraDetails = err.extraDetails || "An error occurred.";
  res.status(status).json({ status, message, extraDetails });
};

module.exports = { authMiddleware, clientOnlyMiddleware, validate, errorMiddleware };