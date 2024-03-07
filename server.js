const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const dataRouter = require("./routes/data");
const mailRouter = require("./routes/mail");

// Middleware
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: "https://data-forge.onrender.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

// Connect to MongoDB
let uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.te788iv.mongodb.net/nextjs-assignment-mar-24?retryWrites=true&w=majority`;

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}
connectToMongoDB();
//
console.log("Hi");

// Routes
app.use("/api/data", dataRouter);
app.use("/api/mail", mailRouter);

// Start the server
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
