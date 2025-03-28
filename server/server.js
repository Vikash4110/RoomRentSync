require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDb = require("./utils/db");
const clientRouter = require("./router/client-router");
const landlordRouter = require("./router/landlord-router");
const { errorMiddleware } = require("./middlewares/landlord-middleware");

const Port = process.env.PORT || 8000;
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/clients", clientRouter);
app.use("/api/landlords", landlordRouter);

app.use(errorMiddleware);

connectDb()
  .then(() => {
    app.listen(Port, () => {
      console.log(`Server is running on port ${Port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });