const express = require("express");
const router = express.Router();
const StoryProgress = require("../../models/Progress/storyProgessModel");


// API endpoint to fetch user progress with story titles
router.get("/storyprogress/:userId", async (req, res) => {
  try {
    const progress = await StoryProgress.findOne({ userId: req.params.userId })
      .populate('readStories', 'title'); // Populate story titles

    if (!progress || !progress.readStories || progress.readStories.length === 0) {
      return res.status(200).json([]); // Return an empty array if no stories read
    }

    // Return the stories with titles
    res.json(progress.readStories);
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress", error: err });
  }
});


// API endpoint to mark a story as read
router.post("/storyprogress", async (req, res) => {
  const { userId, storyId } = req.body;
  try {
    // Find or create progress for the user
    let storyprogress = await StoryProgress.findOne({ userId });

    // If no progress exists, create a new progress record
    if (!storyprogress) {
      storyprogress = new StoryProgress({
        userId,
        readStories: [], // Initialize with empty array
      });
    }

    // Check if the story is already marked as read
    if (storyprogress.readStories.includes(storyId)) {
      return res.status(409).json({ message: "Story already marked as read" });
    }

    // Add the story to readStories (store the ObjectId of the story)
    storyprogress.readStories.push(storyId);

    // Save the progress
    await storyprogress.save();
    res.status(200).json({ message: "Progress updated successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Error updating progress", error: err.message });
  }
});

module.exports = router;
