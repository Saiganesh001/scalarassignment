const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  cabName: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  tripCost: {
    type: Number,
    required: true,
  },
});

const Booking = mongoose.model("booking", bookingSchema);

module.exports = Booking;
