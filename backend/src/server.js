import express from "express";
import { ENV } from "../config/env.js";
import { db } from "../config/db.js";
import { favoritesTable } from "./db/schema.js";

// Initialize Express app
const app = express();
const PORT = ENV.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is healthy" });
});

app.post("/api/favorites", async (req, res) => {
  // Logic to add a favorite recipe
  try {
    // Add logic to save the favorite recipe to the database
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json({
      success: true,
      message: "Recipe added to favorites",
      data: newFavorite,
    });
  } catch (error) {
    console.error("Error adding favorite recipe:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add recipe to favorites" });
  }
});

// Middleware to parse JSON requests
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
