const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT;
const searchApiRoutes = require("./src/SearchService/src/routes/index");
const authApiRoutes = require("./src/AuthService/src/routes/index");
// const ReminderApiRoutes = require("./SearchService/src/routes/index");
const bookingApiRoutes = require("./src/AirticketBookingService/src/routes/index");

const {
  isAuthenticated,
  validateAuthRequest,
  validateFlightRequest,
  errorHandler,
} = require("./middlewares/request-middleware.js");

// const db = require("./models/index");
// const { Airplane } = require("./models/index");

const setupAndStartServer = async () => {
  // create the express object
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/searchservice/api", validateFlightRequest, searchApiRoutes);
  app.use("/authservice/api", validateAuthRequest, authApiRoutes);
  app.use("/bookingservice/api", isAuthenticated, bookingApiRoutes);

  // app.use((req, res, next) => {
  //   const err = new Error("Not Found");
  //   err.status = 404;
  //   next(err);
  // });

  app.use((req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    res.status(500).json({ error: "This route does not exist" });
  });

  app.listen(PORT, async () => {
    console.log(`Server started at Port : ${PORT}`);
    if (process.env.SYNC_DB) {
      db.sequelize.sync({ alter: true });
    }
  });
};

setupAndStartServer();
