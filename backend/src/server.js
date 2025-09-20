import express from "express";
import { ENV } from "../config/env.js";

// Initialize Express app
const app = express();
const PORT = ENV.PORT || 3000;

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
  // res.send("Hello World!");
});

// Middleware to parse JSON requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
