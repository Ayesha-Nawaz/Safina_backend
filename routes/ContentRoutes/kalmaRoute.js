const express = require('express');
const Kalma = require('../../models/contentModels/kalmaModel'); // Assuming the model is saved in 'models/Kalma.js'

const router = express.Router();

// POST request to add Kalma
router.post('/addkalma', async (req, res) => {
  try {
    const kalma = new Kalma(req.body); // req.body contains the Kalma data
    await kalma.save();
    res.status(201).json(kalma); // Respond with the created Kalma data
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to fetch all Kalma
router.get('/kalmas', async (req, res) => {
  try {
    const kalmas = await Kalma.find().sort({ id: 1 }); // You can modify sorting if needed
    res.json(kalmas); // Respond with the fetched Kalmas
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET request to fetch Kalma by id
router.get('/:id', async (req, res) => {
  try {
    const kalma = await Kalma.findById(req.params.id); // Find Kalma by id
    if (!kalma) {
      return res.status(404).json({ message: 'Kalma not found' });
    }
    res.json(kalma); // Respond with the fetched Kalma
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT request to update Kalma by id
router.put('/:id', async (req, res) => {
  try {
    const kalma = await Kalma.findById(req.params.id); // Find Kalma by id
    if (!kalma) {
      return res.status(404).json({ message: 'Kalma not found!' });
    }
    Object.assign(kalma, req.body); // Update Kalma with new data
    await kalma.save();
    res.json(kalma); // Respond with the updated Kalma
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE request to delete Kalma by id
router.delete('/:id', async (req, res) => {
  try {
    const kalma = await Kalma.findById(req.params.id); // Find Kalma by id
    if (!kalma) {
      return res.status(404).json({ message: 'Kalma not found' });
    }
    await kalma.deleteOne(); // Delete the Kalma
    res.json({ message: 'Kalma deleted successfully' }); // Respond with success message
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;