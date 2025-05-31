const mongoose = require("mongoose");
const initData = require("./data.js");

const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://localhost:27017/wanderlust";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((error) => {
    console.log(error);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6831693f35537ae8fc9119de",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialised");
};

initDB();
