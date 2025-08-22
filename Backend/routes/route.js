const express = require("express");
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

      res.json({ input, value });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).send("An error occurred while generating content.");
    }
  }
);

module.exports = router;
