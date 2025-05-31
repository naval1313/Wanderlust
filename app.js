if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// using express router for listings
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((error) => {
    console.log(error);
  });

// setting up ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// parsing data in express
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// mongo Session store using connect-mongo.for Atlas,
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

// to check if any error comes in mongo session store, using. on method
store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

// session options
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxASge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// root route
// app.get("/", (req, res) => {
//   res.send("root is working");
// });

// using session as a middleware
app.use(session(sessionOptions));
app.use(flash());

// initialise passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate));

// using static serialize and deserialize of model for passport session support
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// flash middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// routes for listings
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// if req doent match to user requested page then this * will send rersponse page not found for all requested pages

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, (req, res) => {
  console.log("server is running on 8080 port");
});

// <% if(success && success.length > 0) { %>
// <!-- this success is an middleware in res.locals in app.js  -->
// <div class="alert alert-success" role="alert"><%= success %></div>
// <% } %>
