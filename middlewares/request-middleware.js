const UserService = require("../src/AuthService/src/services/user-service");
const userService = new UserService();

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const authData = await userService.isAuthenticated(token);
    if (authData.userStatus !== "Active") {
      return res.status(401).json({
        message: "Please , Verify your email address and try again",
      });
    }
    req.id = authData.id;
    next();
  } catch (error) {
    // console.log("hi", error);
    return res.status(error.statusCode || 500).json({
      message: error.message || "Something went wrong in the server",
    });
  }
};

const verifyRole = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const authData = await userService.isAuthenticated(token);
    const adminData = await userService.isAdmin(authData.id);
    if (!adminData) {
      return res.status(403).json({
        message: "Forbidden, User does not have admin role",
      });
    }
    next();
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: "Unauthorized, Unable to verify role",
    });
  }
};

const validateAuthRequest = async (req, res, next) => {
  if (req.path !== "/api/v1/grantrole") {
    return next();
  }
  await verifyRole(req, res, next);
};

const validateFlightRequest = async (req, res, next) => {
  if (req.method === "GET" && req.path !== "/api/v1/allflights") {
    return next();
  }
  await verifyRole(req, res, next);
};

const errorHandler = (err, req, res) => {
  console.error(err);
  res.status(500).send("Internal server error");
};
module.exports = {
  isAuthenticated,
  validateAuthRequest,
  validateFlightRequest,
  errorHandler,
};
