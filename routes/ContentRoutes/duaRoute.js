const express = require('express');
const Dua = require('../../models/contentModels/duaModel'); // Assuming the model is saved in 'models/Kalma.js'

const router = express.Router();

// POST request to add Kalma
router.post('/addDua', async (req, res) => {
  try {
    const dua = new Dua(req.body); // req.body contains the Kalma data
    await dua.save();
    res.status(201).json(dua); // Respond with the created Kalma data
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET request to fetch all Kalma
router.get('/getDua', async (req, res) => {
  try {
    const duas = await Dua.find().sort({ id: 1 }); // You can modify sorting if needed
    res.json(duas); // Respond with the fetched Kalmas
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get single dua
router.get('/:id', async (req, res) => {
  try {
    const dua = await Dua.findById(req.params.id); // Find Kalma by id
    if (!dua) {
      return res.status(404).json({ message: 'Dua not found' });
    }
    res.json(dua); // Respond with the fetched Kalma
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// PUT request to add Kalma
router.put('/updateDua/:id', async (req, res) => {
    try {
        const dua = await Dua.findById(req.params.id);

        if(!dua)
        {
           res.status(404).json({message:"Dua not found."})
        }

        Object.assign(dua,req.body);
        const updatedDua = dua.save();
        res.status(201).json(updatedDua); 
    } 
    
    catch (error) {
      res.status(400).json({ message: error.message });
    }
  });


  // DELETE request to add Kalma
router.delete('/deleteDua/:id', async (req, res) => {
    try {
        const Deldua = await Dua.findByIdAndDelate(req.params.id);

        if(!Deldua)
        {
           res.status(404).json({message:"Dua not found."})
        }

        res.json({message:"Deleted successfully"}); 
    } 
    
    catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


module.exports = router;
