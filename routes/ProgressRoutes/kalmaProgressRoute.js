const express = require("express");
const router = express.Router();
const KalmaProgress = require("../../models/Progress/kalmaprogressModel");

// API endpoint to fetch user Kalma progress
router.get("/kalmaprogress/:userId", async (req, res) => {
  try {
    const kalmaprogress = await KalmaProgress.findOne({ userId: req.params.userId })
      .populate('kalmalearnt', 'title');

    if (!kalmaprogress || !kalmaprogress.kalmalearnt || kalmaprogress.kalmalearnt.length === 0) {
      return res.status(200).json([]); // Return an empty array if no Kalma progress
    }

    res.json(kalmaprogress.kalmalearnt); // Return the learned Kalmas array
  } catch (err) {
    res.status(500).json({ message: "Error fetching progress", error: err });
  }
});


router.post("/kalmaprogress", async (req, res) => {
  const { userId, kalmaId } = req.body;

  try {
    let kalmaProgress = await KalmaProgress.findOne({ userId });

    if (!kalmaProgress) {
      kalmaProgress = new KalmaProgress({
        userId,
        kalmalearnt: [],
      });
    }

    if (kalmaProgress.kalmalearnt.includes(kalmaId)) {
      return res.status(409).json({ message: "Kalma already marked as learn" }); // Changed to 409
    }

    kalmaProgress.kalmalearnt.push(kalmaId);
    await kalmaProgress.save();
    res.status(200).json({ message: "Progress updated successfully" });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Error updating progress", error: err.message });
  }
});

module.exports = router;
