const express = require("express");
const multer = require("multer");
const fs = require("fs");
const FormData = require("form-data"); // still needed

const upload = multer({ dest: "uploads/" });
const User = require("../models/User.js");

const { body, validationResult } = require("express-validator");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const router = express.Router();

router.post(
  "/chat",
  [
    body("input")
      .isString()
      .withMessage("Message must be a string")
      .isLength({ min: 1 })
      .withMessage("Message cannot be empty")
      .trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const input = req.body.input;

    try {
      const genAI = new GoogleGenerativeAI("AIzaSyCMo1jOK-dAjYPOqXG6KYf7z9flE0iFgr4");
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(input);
      const value = result.response.text();
      console.log(value);
      res.json({ input, value });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).send("An error occurred while generating content.");
    }
  }
);


router.post("/analyze", upload.single("edffile"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No EDF file uploaded" });

  try {
    // Prepare file for EEG API
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    const eegResponse = await fetch("https://586f8e852237.ngrok-free.app/predict", {
      method: "POST",
      body: formData,
      headers: formData.getHeaders(),
    });

    const eegResult = await eegResponse.json();

    // Delete uploaded file
    fs.unlinkSync(req.file.path);

    // Return full EEG JSON result
    res.json(eegResult);

  } catch (error) {
    console.error("EEG analysis error:", error);
    res.status(500).json({ error: "Error analyzing EDF file" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

module.exports = router;