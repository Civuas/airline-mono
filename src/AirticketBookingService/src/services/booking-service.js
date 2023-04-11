const axios = require("axios");

const { BookingRepository } = require("../repository/index");
const { FLIGHT_SERVICE_PATH, AUTH_SERVICE_PATH, REMINDER_BINDING_KEY } = require("../config/serverConfig");
const { ServiceError } = require("../utils/errors");
const FlightService = require("../../../SearchService/src/services/flight-service");
const UserService = require("../../../AuthService/src/services/user-service");
const TicketService = require("../../../ReminderService/src/services/email-service");
// const { createChannel, publishMessage } = require("../utils/messageQueue");
const { subtract24Hour, getDateTimeIST } = require("../utils/helpers/index");

const flightService = new FlightService();
const userService = new UserService();

class BookingService {
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
      const flightId = data.flightId;

      // const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/searchservice/api/v1/flights/${flightId}`;
      // const getFlightRequestURL = `${FLIGHT_SERVICE_PATH}/searchservice/api/v1/flights/${flightId}`;
      const flightData = await flightService.getFlight(flightId);
      // const flightData = response.data.data;
      let priceOfTheFlight = flightData.price;
      if (data.noOfSeats > flightData.totalSeats) {
        throw new ServiceError("Something went wrong in the booking process", "Insufficient seats in the flights");
      }
      const totalCost = priceOfTheFlight * data.noOfSeats;
      const bookingPayload = { ...data, totalCost };
      console.log("emjoidsofjs--->", bookingPayload);
      const booking = await this.bookingRepository.create(bookingPayload);
      // const updateFlightRequestURL = `${FLIGHT_SERVICE_PATH}/searchservice/api/v1/flights/${booking.flightId}`;
      // await axios.patch(updateFlightRequestURL, { totalSeats: flightData.totalSeats - booking.noOfSeats });
      await flightService.updateFlight(booking.flightId, { totalSeats: flightData.totalSeats - booking.noOfSeats });
      const finalBooking = await this.bookingRepository.update(booking.id, { status: "Booked" });
      // to get user details from  auth-service
      // const getUserRequestURL = `${AUTH_SERVICE_PATH}/authservice/api/v1/users/${finalBooking.userId}`;
      // console.log(finalBooking.userId);
      const userData = await userService.getUserById(finalBooking.userId);
      // console.log(userData);
      // const userData = authResponse.data.data;

      // prepare the channel and payloads
      // const channel = await createChannel();

      const payload1 = {
        data: {
          mailFrom: "noreply.verifyemailauthservice@gmail.com",
          mailTo: userData.email,
          mailSubject: "Booking Success Confimation",
          mailBody: `Hi ${
            userData.userName
          }. Your flight has been successfully booked .Your flight details are as follows:

          Flight Number: ${flightData.flightNumber}
          Date: ${getDateTimeIST(flightData.departureTime)}
          
          We are glad to have you onboard and we look forward to making your journey with us a memorable one. If you have any queries or concerns, please don't hesitate to reach out to us.
          
          Thank you for choosing us. `,
        },
        service: "SEND_BASIC_MAIL",
      };

      const payload2 = {
        data: {
          subject: "Reminder for flight ",
          content: ` This is a reminder that you have a scheduled flight in the next 24hrs on ${getDateTimeIST(
            flightData.departureTime
          )} (send boarding pass in  pdf in future maybe)`,
          recepientEmail: userData.email,
          notificationTime: subtract24Hour(flightData.departureTime), // some calculation required
        },
        service: "CREATE_TICKET",
      };
      // Will be send immediately
      await TicketService.subscribeEvents(payload1);
      await TicketService.subscribeEvents(payload2);
      // publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload1));
      // Will be send 24hr before the flights departure time
      // publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload2));

      return finalBooking;
    } catch (error) {
      console.log("service hi", error);
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }
      throw new ServiceError();
    }
  }
  async updateBooking(bookingId, data) {
    try {
      const finalBooking = await this.bookingRepository.update(bookingId, { status: data.status });
      return finalBooking;
    } catch (error) {
      if (error.name == "RepositoryError" || error.name == "ValidationError") {
        throw error;
      }
      throw new ServiceError();
    }
  }
}

module.exports = BookingService;
