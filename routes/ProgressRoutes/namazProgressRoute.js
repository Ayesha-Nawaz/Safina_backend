const express = require("express");
const router = express.Router();
const NamazProgress = require("../../models/Progress/namazProgressModel");

// GET: Fetch namaz progress by user, including full namaz details
router.get("/namazprogress/:userId", async (req, res) => {
  try {
    const progress = await NamazProgress.findOne({ userId: req.params.userId })
      .populate("progress.namazItems", "category dua");

    if (!progress || !progress.progress || progress.progress.length === 0) {
      return res.status(200).json([]); // Return empty if no progress yet
    }

    res.status(200).json(progress.progress);
  } catch (err) {
    console.error("Error fetching namaz progress:", err);
    res.status(500).json({ message: "Error fetching namaz progress", error: err.message });
  }
});

// POST: Update namaz progress by category, namaz item, and dua
router.post("/namazprogress", async (req, res) => {
  try {
    const { userId, category, dua, namazId } = req.body;
    
    // Validate required fields
    if (!userId || !category || !namazId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user exists in the database
    // (This would depend on your user model implementation)
    
    // Find existing progress document for this user
    let userProgress = await NamazProgress.findOne({ userId });
    
    if (!userProgress) {
      // Create new progress document if none exists
      userProgress = new NamazProgress({
        userId,
        progress: []
      });
    }
    
    // Find the category in progress array
    let categoryProgress = userProgress.progress.find(p => p.category === category);
    
    if (!categoryProgress) {
      // Create new category if it doesn't exist
      categoryProgress = {
        category,
        dua, // Store the dua field here
        namazItems: [namazId]
      };
      userProgress.progress.push(categoryProgress);
    } else {
      // Update existing category
      
      // Add the dua field if provided
      if (dua) {
        categoryProgress.dua = dua;
      }
      
      // Check if namazId already exists to avoid duplicates
      if (!categoryProgress.namazItems.includes(namazId)) {
        categoryProgress.namazItems.push(namazId);
      } else {
        return res.status(200).json({ message: 'Namaz item already marked as read' });
      }
    }
    
    // Save updated progress document
    await userProgress.save();
    
    return res.status(200).json({ 
      message: 'Progress saved successfully',
      progress: userProgress
    });
    
  } catch (error) {
    console.error('Error saving progress:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;