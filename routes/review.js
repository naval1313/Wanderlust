const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedin,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// Review Form in show.ejs
// POST Review Route for reviews
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(reviewController.createReviews)
);

// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReviews)
);

module.exports = router;
