const express = require("express");
const mongoose = require("mongoose");
const Bookmark = require("../models/bookmark");
const Dua = require("../models/contentModels/duaModel");
const Story = require("../models/contentModels/StoryModel");
const Kalma = require("../models/contentModels/kalmaModel");

const router = express.Router();

// Helper function to get title based on content type and ID
async function getContentTitle(contentType, contentId) {
  try {
    switch(contentType) {
        
      case 'Dua':
        // Handle entire dua category using MongoDB ObjectID
        try {
          // Check if contentId is a valid MongoDB ObjectID
          if (mongoose.Types.ObjectId.isValid(contentId)) {
            const duaCategory = await Dua.findById(contentId);
            if (duaCategory) return duaCategory.topic;
          }
        } catch (err) {
          console.error("Error finding Dua category:", err);
        }
        return null;
      case 'Story':
         const story = await Story.findById(contentId);
           return story ? story.title : null;
      case 'Kalma':
        const kalma = await Kalma.findById(contentId);
        return kalma ? kalma.title : null;                                                                                      
      default:
        return null;
    }
  } catch (error) {
    console.error("Error fetching content title:", error);
    return null;
  }
}

// Check if content is bookmarked (unchanged)
router.get("/check", async (req, res) => {
  const { userId, contentId, contentType } = req.query;

  console.log("Bookmark check request received:", { userId, contentId, contentType });

  if (!userId || !contentId || !contentType) {
    return res.status(400).json({
      message: "Missing required fields",
      required: ["userId", "contentId", "contentType"],
      received: { userId, contentId, contentType },
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message: "Invalid userId format",
      received: userId,
    });
  }

  try {
    const userBookmarks = await Bookmark.findOne({ userId });
    const isBookmarked = userBookmarks?.bookmarks.some(
      (bookmark) =>
        bookmark.contentId === contentId &&
        bookmark.contentType === contentType
    );

    res.status(200).json({ isBookmarked: !!isBookmarked });
  } catch (error) {
    console.error("Bookmark check error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get bookmarks (updated to return titles)
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;
  const { contentId } = req.query;

  console.log("Get bookmarks request:", { userId, contentId });

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const userBookmarks = await Bookmark.findOne({ userId });

    if (!userBookmarks) {
      return res.status(200).json({ bookmarks: [] }); // Return empty array instead of 404
    }

    if (contentId) {
      const filteredBookmarks = userBookmarks.bookmarks.filter(
        (bookmark) => bookmark.contentId === contentId
      );
      return res.status(200).json({ bookmarks: filteredBookmarks });
    }

    res.status(200).json({ bookmarks: userBookmarks.bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Error fetching bookmarks" });
  }
});

// Alternative get route (unchanged)
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { contentId } = req.query;

  console.log("Get bookmarks request (alternative route):", { userId, contentId });

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const userBookmarks = await Bookmark.findOne({ userId });

    if (!userBookmarks) {
      return res.status(200).json({ bookmarks: [] });
    }

    if (contentId) {
      const filteredBookmarks = userBookmarks.bookmarks.filter(
        (bookmark) => bookmark.contentId === contentId
      );
      return res.status(200).json({ bookmarks: filteredBookmarks });
    }

    res.status(200).json({ bookmarks: userBookmarks.bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ message: "Error fetching bookmarks" });
  }
});

// Add bookmark (updated to include title)
router.post("/add", async (req, res) => {
  const { userId, contentId, contentType } = req.body;

  console.log("Add bookmark request:", req.body);

  if (!userId || !contentId || !contentType) {
    return res.status(400).json({ message: "Missing required fields: userId, contentId, or contentType" });
  }

  try {
    // Get the title for the content
    const title = await getContentTitle(contentType, contentId);
    if (!title) {
      return res.status(404).json({ message: "Content not found or invalid content type" });
    }

    let userBookmarks = await Bookmark.findOne({ userId });

    if (!userBookmarks) {
      userBookmarks = new Bookmark({ userId, bookmarks: [] });
    }

    const bookmarkExists = userBookmarks.bookmarks.some(
      (bookmark) => bookmark.contentId === contentId && bookmark.contentType === contentType
    );

    if (bookmarkExists) {
      return res.status(409).json({ message: "Bookmark already exists" });
    }

    userBookmarks.bookmarks.push({ contentId, contentType, title });
    await userBookmarks.save();

    res.status(201).json({ 
      message: "Bookmark added successfully", 
      bookmarks: userBookmarks.bookmarks 
    });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ message: "Error adding bookmark" });
  }
});

// Delete bookmark (original route - unchanged)
router.delete("/delete", async (req, res) => {
  const { userId, contentId } = req.body;

  console.log("Delete bookmark request:", req.body);

  if (!userId || !contentId) {
    return res.status(400).json({ message: "Missing userId or contentId" });
  }

  try {
    const userBookmarks = await Bookmark.findOne({ userId });

    if (!userBookmarks) {
      return res.status(404).json({ message: "No bookmarks found for this user" });
    }

    const initialLength = userBookmarks.bookmarks.length;
    userBookmarks.bookmarks = userBookmarks.bookmarks.filter(
      (bookmark) => bookmark.contentId !== contentId
    );

    if (userBookmarks.bookmarks.length === initialLength) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await userBookmarks.save();

    res.status(200).json({ 
      message: "Bookmark deleted successfully", 
      bookmarks: userBookmarks.bookmarks 
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ message: "Error deleting bookmark" });
  }
});

// Alternative delete route (unchanged)
router.delete("/:userId/:contentId", async (req, res) => {
  const { userId, contentId } = req.params;

  console.log("Delete bookmark request (alternative route):", { userId, contentId });

  if (!userId || !contentId) {
    return res.status(400).json({ message: "Missing userId or contentId" });
  }

  try {
    const userBookmarks = await Bookmark.findOne({ userId });

    if (!userBookmarks) {
      return res.status(404).json({ message: "No bookmarks found for this user" });
    }

    const initialLength = userBookmarks.bookmarks.length;
    userBookmarks.bookmarks = userBookmarks.bookmarks.filter(
      (bookmark) => bookmark.contentId !== contentId
    );

    if (userBookmarks.bookmarks.length === initialLength) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    await userBookmarks.save();

    res.status(200).json({ 
      message: "Bookmark deleted successfully", 
      bookmarks: userBookmarks.bookmarks 
    });
  } catch (error) {
    console.error("Error deleting bookmark:", error);
    res.status(500).json({ message: "Error deleting bookmark" });
  }
});

module.exports = router;