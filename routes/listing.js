const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedin, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js");

// using multer to parsse form-data,and multer saves files in uploads folder.
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// using router.route to combine routes of same path , here we combine "/" path funcs.
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedin,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New Route
router.get("/new", isLoggedin, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedin,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

// Edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
