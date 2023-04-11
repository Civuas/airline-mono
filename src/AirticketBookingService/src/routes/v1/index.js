const express = require("express");

const { BookingController } = require("../../controllers/");
// const { createChannel } = require("../../utils/messageQueue");

// const channel = await createChannel();
const bookingController = new BookingController();
const { isAuthenticated } = require("../../middlewares/auth");
const router = express.Router();

// testing get route for booking.
router.get("/info", (req, res) => {
  return res.json({
    message: "Info from the booking service",
  });
});
router.post("/bookings", bookingController.create);
// router.post("/publish", bookingController.sendMessageToQueue);
router.patch("/bookings/:id", bookingController.update);

module.exports = router;
