const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const { createServer } = require("http");
const cors = require("cors");

const httpServer = createServer(app);

app.use(express.json({ limit: "4mb" }));
app.use(cors());

module.exports = httpServer;
