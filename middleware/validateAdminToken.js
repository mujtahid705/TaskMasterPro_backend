const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const validateAdminToken = asyncHandler(async (req, res, next) => {
  let token;

  const header = req.headers.authorization || req.headers.Authorization;

  if (header) {
    token = header.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(400);
        throw new Error("User not authorized");
      }

      req.admin = decode.admin;
      next();
    });

    if (!token) {
      res.status(401);
      throw new Error("Token not found");
    }
  } else {
    res.status(400);
    throw new Error("Header not found");
  }
});

module.exports = validateAdminToken;
