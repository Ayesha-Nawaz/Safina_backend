const express = require("express");
const router = express.Router();
const DuaProgress = require("../../models/Progress/duaProgressModel");

const Dua = require("../../models/contentModels/duaModel"); // Make sure to import your Dua model

// Improved GET endpoint for dua progress
router.get("/duaprogress/:userId", async (req, res) => {
  try {
    const duaProgress = await DuaProgress.findOne({ userId: req.params.userId })
      .populate({
        path: 'dualearnt',
        select: 'topic duas.titleEng duas.titleUrdu', // Select the fields you need
        options: { lean: true } // Convert to plain JavaScript objects
      });

    if (!duaProgress || !duaProgress.dualearnt || duaProgress.dualearnt.length === 0) {
      return res.status(200).json([]);
    }

    // Transform the data to a simpler format for the frontend
    const formattedDuas = duaProgress.dualearnt.map(dua => ({
      _id: dua._id,
      topic: dua.topic,
      title: dua.duas[0]?.titleEng || dua.topic, // Fallback to topic if no title
      titleUrdu: dua.duas[0]?.titleUrdu || '' // Empty string if no Urdu title
    }));

    res.json(formattedDuas);
    console.log("Returning dua progress:", formattedDuas); // Debug logging

  } catch (err) {
    console.error("Error fetching dua progress:", err);
    res.status(500).json({ 
      message: "Error fetching progress", 
      error: err.message 
    });
  }
});

// POST endpoint (keep your existing implementation)
router.post("/duaprogress", async (req, res) => {
  const { userId, duaId } = req.body;

  try {
    // Validate input
    if (!userId || !duaId) {
      return res.status(400).json({ message: "userId and duaId are required" });
    }

    // Verify the dua exists
    const duaExists = await Dua.findById(duaId);
    if (!duaExists) {
      return res.status(404).json({ message: "Dua not found" });
    }

    let duaProgress = await DuaProgress.findOne({ userId });

    if (!duaProgress) {
      duaProgress = new DuaProgress({
        userId,
        dualearnt: [],
      });
    }

    if (duaProgress.dualearnt.includes(duaId)) {
      return res.status(400).json({ message: "Dua already marked as learn" });
    }

    duaProgress.dualearnt.push(duaId);
    await duaProgress.save();

    res.status(200).json({ 
      message: "Progress updated successfully",
      learnedDuas: duaProgress.dualearnt 
    });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ 
      message: "Error updating progress", 
      error: err.message 
    });
  }
});



router.post("/duaprogress", async (req, res) => {
  const { userId, duaId } = req.body;

  try {
    // Find or create progress for the user
    let duaProgress = await DuaProgress.findOne({ userId });

    if (!duaProgress) {
        duaProgress = new DuaProgress({
        userId,
        dualearnt: [], // Initialize empty array
      });
    }

     // Check if kalma is already marked as read
     if (duaProgress.dualearnt.includes(duaId)) {
      return res.status(400).json({ message: "Dua already marked as Learn" });
    }

    // Add the kalma to kalmalearnt array
    duaProgress.dualearnt.push(duaId);

    // Save the progress
    await duaProgress.save();
    res.status(200).json({ message: "Progress updated successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Error updating progress", error: err.message });
  }
});


module.exports = router;
