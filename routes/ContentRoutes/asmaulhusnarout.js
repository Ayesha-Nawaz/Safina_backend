const express = require("express");
const router = express.Router();
const AsmaulHusna = require("../../models/contentModels/asmaulhusnaModel");

// ➤ GET all names
router.get("/names", async (req, res) => {
  try {
    const names = await AsmaulHusna.find();
    res.status(200).json(names);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ GET a specific name by id
router.get("/:id", async (req, res) => {
  try {
    const name = await AsmaulHusna.findById(req.params.id);
    if (!name) return res.status(404).json({ message: "Name not found" });
    res.status(200).json(name);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ ADD a new name
router.post("/name", async (req, res) => {
    console.log("Received Data:", req.body); // ✅ Debugging Log
  
    // Check if required fields are missing
    const { number, arabic, transliteration, urdu, meaning, urduMeaning, details, urduExplanation ,audio} = req.body;
  
    if (!number || !arabic || !transliteration || !urdu || !meaning || !urduMeaning || !details || !urduExplanation|| !audio) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }
  
    try {
      const newName = new AsmaulHusna(req.body);
      const savedName = await newName.save();
      res.status(201).json(savedName);
    } catch (error) {
      console.error("Error Saving Data:", error.message); // ✅ Debugging Log
      res.status(400).json({ message: error.message });
    }
  });
  

//add more than 1
//-------------
//--------------


  router.post("/names", async (req, res) => {
    console.log("Received Data:", req.body); // ✅ Debugging Log

    const { names } = req.body; // Expecting an array of names

    // Check if the names array exists and has at least one entry
    if (!Array.isArray(names) || names.length === 0) {
        return res.status(400).json({ message: "Please provide an array of names." });
    }

    // Validate each object in the array
    for (const name of names) {
        const { number, arabic, transliteration, urdu, meaning, urduMeaning, details, urduExplanation, audio } = name;

        if (!number || !arabic || !transliteration || !urdu || !meaning || !urduMeaning || !details || !urduExplanation || !audio) {
            return res.status(400).json({ message: "Each name must have all required fields." });
        }
    }

    try {
        // Insert all names at once using insertMany
        const savedNames = await AsmaulHusna.insertMany(names);
        res.status(201).json({ message: `${names.length} names added successfully!`, data: savedNames });
    } catch (error) {
        console.error("Error Saving Data:", error.message); // ✅ Debugging Log
        res.status(500).json({ message: "Error saving names", error: error.message });
    }
});





// ➤ UPDATE a name by number
router.put("/:number", async (req, res) => {
  try {
    const updatedName = await AsmaulHusna.findOneAndUpdate(
      { number: req.params.number },
      req.body,
      { new: true }
    );
    if (!updatedName) return res.status(404).json({ message: "Name not found" });
    res.status(200).json(updatedName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ➤ DELETE a name by number
router.delete("/:number", async (req, res) => {
  try {
    const deletedName = await AsmaulHusna.findOneAndDelete({ number: req.params.number });
    if (!deletedName) return res.status(404).json({ message: "Name not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
