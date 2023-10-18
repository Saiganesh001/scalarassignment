const express = require("express");
const router = express.Router();

const {
  getAllBooking,
  postCreateBooking,
  putUpdateBooking,
} = require("../controllers/booking");

/**
 * @route GET api/booking
 * @description get all booking
 * @access public
 */
router.get("/", getAllBooking);
/**
 * @route POST api/booking
 * @description add a new booking
 * @access public
 */
router.post("/", postCreateBooking);

/**
 * @route PUT api/booking/:id
 * @description update booking
 * @access public
 */

module.exports = router;
