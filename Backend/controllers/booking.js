const Booking = require("../models/booking");

exports.getAllBooking = (req, res) => {
  Booking.find()
    .then((todo) => res.json(todo))
    .catch((err) =>
      res.status(404).json({ message: "Todo not found", error: err.message })
    );
};
exports.postCreateBooking = (req, res) => {
  Booking.create(req.body)
    .then((data) => res.json({ message: "Booking added successfully", data }))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Failed to add booking", error: err.message })
    );
};

exports.putUpdateBooking = (req, res) => {
  Booking.findByIdAndUpdate(req.params.id, req.body)
    .then((data) => res.json({ message: "updated successfully", data }))
    .catch((err) =>
      res
        .status(400)
        .json({ message: "Failed to update booking", error: err.message })
    );
};
