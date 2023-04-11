const UserService = require("../../../AuthService/src/services/user-service");
const userService = new UserService();

const isAuthenticated = async (req, res, next) => {
  try {
    // const { data: authData } = await authService.get("isAuthenticated", {
    //   headers: {
    //     "x-access-token": req.headers["x-access-token"],
    //   },
    // });
    const token = req.headers["x-access-token"];
    const authData = await userService.isAuthenticated(token);
    console.log(authData);
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

module.exports = {
  isAuthenticated,
};
