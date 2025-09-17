import * as dotenv from "dotenv";
import express from "express";
import { connectDb } from "./db/connectDb.js";

dotenv.config();

const app = express();
app.use(express.json());
app.get("/ping", (req, res) => {
  res.json({ status: "pong" });
});

const port = process.env.PORT || 3000;

const start = async () => {
  await connectDb();
  app.listen(port, () => {
    console.info(`Listening on port ${port}`);
  });
};

start();
