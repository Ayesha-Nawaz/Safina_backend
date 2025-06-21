const express = require("express");
const router = express.Router();
const Schedule = require("../models/schedulemodel");
const mongoose = require('mongoose');

// Get user's schedule
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    let userSchedule = await Schedule.findOne({ 
      userId: userId,
      isActive: true 
    });

    if (!userSchedule) {
      // If no schedule exists, create one
      userSchedule = new Schedule({
        userId,
        activities: [],
        isActive: true
      });
      await userSchedule.save();
    }

    // Filter out expired activities
    const currentTime = new Date();
    const activeActivities = userSchedule.activities.filter(activity => {
      const expirationTime = new Date(activity.createdAt);
      expirationTime.setDate(expirationTime.getDate() + (activity.durationWeeks * 7));
      return currentTime <= expirationTime;
    });

    // Update the document to remove expired activities
    if (activeActivities.length !== userSchedule.activities.length) {
      userSchedule.activities = activeActivities;
      await userSchedule.save();
    }

    // Transform activities to match the expected frontend format
    const transformedActivities = activeActivities.map(activity => ({
      _id: activity._id,
      userId: userSchedule.userId,
      title: activity.title,
      time: activity.time,
      durationWeeks: activity.durationWeeks,
      color: activity.color,
      isActive: activity.isActive,
      createdAt: activity.createdAt
    }));

    res.json(transformedActivities);
  } catch (err) {
    console.error('Schedule Fetch Error:', err);
    res.status(500).json({ 
      message: "Error fetching schedules",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Create new activity
router.post("/", async (req, res) => {
  try {
    const { userId, title, time, durationWeeks, color } = req.body;

    // Validate required fields
    if (!userId || !title || !time || !durationWeeks) {
      return res.status(400).json({
        message: "Missing required fields",
        details: {
          userId: !userId ? "User ID is required" : null,
          title: !title ? "Title is required" : null,
          time: !time ? "Time is required" : null,
          durationWeeks: !durationWeeks ? "Duration is required" : null
        }
      });
    }

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    let userSchedule = await Schedule.findOne({ userId });
    
    if (!userSchedule) {
      userSchedule = new Schedule({
        userId,
        activities: []
      });
    }

    const newActivity = {
      title: title.trim(),
      time,
      durationWeeks: parseInt(durationWeeks),
      color: color || '#4A90E2',
      isActive: true,
      createdAt: new Date()
    };

    // Validate time format before saving
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        message: "Invalid time format",
        details: "Time must be in 24-hour format (HH:mm)"
      });
    }

    // Validate duration
    if (durationWeeks < 1 || durationWeeks > 52) {
      return res.status(400).json({
        message: "Invalid duration",
        details: "Duration must be between 1 and 52 weeks"
      });
    }

    // Add activity to the array
    userSchedule.activities.push(newActivity);

    try {
      await userSchedule.save();
    } catch (validationError) {
      console.error('Validation Error:', validationError);
      return res.status(400).json({
        message: "Validation error",
        details: validationError.message
      });
    }

    // Transform the response to match frontend expectations
    const transformedActivity = {
      _id: userSchedule.activities[userSchedule.activities.length - 1]._id,
      userId,
      ...newActivity
    };

    res.status(201).json({ 
      message: "Schedule created successfully", 
      schedule: transformedActivity
    });
  } catch (err) {
    console.error('Create Schedule Error:', err);
    res.status(500).json({ 
      message: "Error creating schedule",
      error: process.env.NODE_ENV === 'development' ? err.toString() : undefined
    });
  }
});

// Update activity
router.put("/:scheduleId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.scheduleId)) {
      return res.status(400).json({ message: "Invalid schedule ID format" });
    }

    const { title, time, durationWeeks, color } = req.body;
    
    const userSchedule = await Schedule.findOne({
      'activities._id': req.params.scheduleId
    });

    if (!userSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const activityIndex = userSchedule.activities.findIndex(
      activity => activity._id.toString() === req.params.scheduleId
    );

    if (activityIndex === -1) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Update the specific activity
    if (title) userSchedule.activities[activityIndex].title = title.trim();
    if (time) userSchedule.activities[activityIndex].time = time;
    if (durationWeeks) userSchedule.activities[activityIndex].durationWeeks = durationWeeks;
    if (color) userSchedule.activities[activityIndex].color = color;

    await userSchedule.save();

    // Transform response to match frontend expectations
    const updatedActivity = {
      _id: userSchedule.activities[activityIndex]._id,
      userId: userSchedule.userId,
      ...userSchedule.activities[activityIndex].toObject()
    };

    res.json({ 
      message: "Schedule updated successfully", 
      schedule: updatedActivity 
    });
  } catch (err) {
    res.status(500).json({ 
      message: "Error updating schedule",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Delete activity
router.delete("/:scheduleId", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.scheduleId)) {
      return res.status(400).json({ message: "Invalid schedule ID format" });
    }

    const userSchedule = await Schedule.findOne({
      'activities._id': req.params.scheduleId
    });

    if (!userSchedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    // Remove the activity from the activities array
    const activityIndex = userSchedule.activities.findIndex(
      activity => activity._id.toString() === req.params.scheduleId
    );

    if (activityIndex === -1) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const deletedActivity = userSchedule.activities[activityIndex];
    userSchedule.activities.splice(activityIndex, 1);
    await userSchedule.save();

    // Transform response to match frontend expectations
    const transformedActivity = {
      _id: deletedActivity._id,
      userId: userSchedule.userId,
      ...deletedActivity.toObject()
    };

    res.json({ 
      message: "Schedule deleted successfully",
      deletedSchedule: transformedActivity
    });
  } catch (err) {
    console.error('Schedule Delete Error:', err);
    res.status(500).json({ 
      message: "Error deleting schedule",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;