const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const { createServer } = require("http");
const cors = require("cors");
const connectDb = require("./database/connectDb");
const { errorMiddleware } = require("./middlewares/error.Middleware");
const { userRouter } = require("./routes/User.Routes");

const httpServer = createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

app.use("api/v1/auth", userRouter)

connectDb()

app.use(errorMiddleware)

module.exports = httpServer;
