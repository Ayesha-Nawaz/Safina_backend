const express = require('express');
const router = express.Router();
const Story = require('../../models/contentModels/StoryModel'); // Ensure this model includes 'type'

// POST route to create a new story
router.post('/poststories', async (req, res) => {
  try {
    const { title, titleUrdu, content, contentUrdu, message, messageUrdu, image, backimage, audio, audioUrdu, type } = req.body;

    // Create a new story
    const newStory = new Story({
      title,
      titleUrdu,
      content,
      contentUrdu,
      message,
      messageUrdu,
      image,
      backimage,
      audio,
      audioUrdu,
      type,  // Added type field
    });

    // Save the new story to the database
    await newStory.save();

    res.status(201).json({ message: 'Story created successfully', story: newStory });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET route to fetch all stories
router.get('/stories', async (req, res) => {
  try {
    const stories = await Story.find();
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET route to fetch a single story by its title
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json(story);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET route to fetch stories by type
router.get('/stories/type/:type', async (req, res) => {
  try {
    const stories = await Story.find({ type: req.params.type });
    if (!stories.length) {
      return res.status(404).json({ message: 'No stories found for this type' });
    }
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});


// PUT route to update a story by ID
router.put('/stories/:id', async (req, res) => {
  try {
    console.log("Updating story with ID:", req.params.id);
    console.log("Update data:", req.body);
    
    const updatedStory = await Story.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    // BUG FIX: Check updatedStory instead of Story
    if (!updatedStory) {
      console.log("Story not found for update with ID:", req.params.id);
      return res.status(404).json({ message: 'Story not found' });
    }
    
    console.log("Story updated successfully:", updatedStory.title);
    res.status(200).json({ 
      message: 'Story updated successfully', 
      story: updatedStory 
    });
  } catch (error) {
    console.error("Error updating story:", error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: error.errors 
      });
    }
    
    // Handle invalid ObjectId
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid story ID format' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE route to delete a story by its ID
router.delete('/stories/:id', async (req, res) => {
  try {
    const deletedStory = await Story.findByIdAndDelete(req.params.id);
    if (!deletedStory) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(200).json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
