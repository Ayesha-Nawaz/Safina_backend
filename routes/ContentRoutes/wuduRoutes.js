const express = require("express");
const Wudu = require("../../models/contentModels/wudumodel"); // Ensure file name matches exactly
const router = express.Router();

// Wudu steps dataset
const wuduSteps = [
  {
    id: 1,
    titleEn: "The Intention",
    titleUr: "نیت",
    descriptionEn: "Make a quiet intention in your heart for this act of cleanliness and devotion to Allah.",
    descriptionUr: "دل میں نیت کریں کہ آپ اللہ کے لیے یہ پاکیزگی کا عمل کر رہے ہیں۔"
  },
  {
    id: 2,
    titleEn: "Wash the Hands",
    titleUr: "ہاتھ دھونا",
    descriptionEn: "Wash both hands three times to cleanse away any dust or dirt.",
    descriptionUr: "دونوں ہاتھ تین بار دھوئیں تاکہ کوئی گرد یا میل ختم ہو جائے۔"
  },
  {
    id: 3,
    titleEn: "Rinse the Mouth",
    titleUr: "کلی کریں",
    descriptionEn: "Rinse your mouth three times, swishing the water to refresh.",
    descriptionUr: "تین بار کلی کریں تاکہ منہ تازہ ہو جائے۔"
  },
  {
    id: 4,
    titleEn: "Clean the Nose",
    titleUr: "ناک صاف کریں",
    descriptionEn: "Inhale water gently into your nose three times and blow it out.",
    descriptionUr: "ناک میں ہلکے سے پانی تین بار چڑھائیں اور صاف کریں۔"
  },
  {
    id: 5,
    titleEn: "Wash the Face",
    titleUr: "چہرہ دھوئیں",
    descriptionEn: "Wash your face from the forehead to the chin three times.",
    descriptionUr: "چہرے کو پیشانی سے ٹھوڑی تک تین بار دھوئیں۔"
  },
  {
    id: 6,
    titleEn: "Wash the Arms",
    titleUr: "بازو دھوئیں",
    descriptionEn: "Wash each arm from wrist to elbow three times, starting with the right arm.",
    descriptionUr: "ہر بازو کو کلائی سے کہنی تک تین بار دھوئیں، دائیں بازو سے شروع کریں۔"
  },
  {
    id: 7,
    titleEn: "Wipe the Head",
    titleUr: "سر کا مسح کریں",
    descriptionEn: "Gently wipe your head once with wet hands.",
    descriptionUr: "گیلے ہاتھوں سے ایک بار سر کا مسح کریں۔"
  },
  {
    id: 8,
    titleEn: "Clean the Ears",
    titleUr: "کان صاف کریں",
    descriptionEn: "Clean the inside and outside of each ear with wet fingers.",
    descriptionUr: "گیلے ہاتھوں سے ہر کان کو اندر اور باہر سے صاف کریں۔"
  },
  {
    id: 9,
    titleEn: "Wash the Feet",
    titleUr: "پاؤں دھوئیں",
    descriptionEn: "Wash each foot up to the ankles three times, starting with the right foot.",
    descriptionUr: "ہر پاؤں کو ٹخنوں تک تین بار دھوئیں، دائیں پاؤں سے شروع کریں۔"
  }
];

// Fetch all Wudu steps
// router.get("/wudu", async (req, res) => {
//   try {
//     const steps = await Wudu.find();
//     res.json(steps);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch Wudu steps" });
//   }
// });

// Fetch all Wudu steps in sequence
router.get("/wudu", async (req, res) => {
  try {
    // Fetch all steps and sort them by id in ascending order
    const steps = await Wudu.find().sort({ id: 1 });
    
    // Add error handling for empty results
    if (steps.length === 0) {
      return res.status(404).json({ error: "No Wudu steps found" });
    }

    res.json(steps);
  } catch (error) {
    console.error("Error fetching Wudu steps:", error);
    res.status(500).json({ error: "Failed to fetch Wudu steps" });
  }
});
// Add multiple Wudu steps in one request
router.post("/addwudu", async (req, res) => {
  try {
    // Check if data already exists to prevent duplicates
    const existingSteps = await Wudu.find();
    if (existingSteps.length > 0) {
      return res.status(400).json({ error: "Wudu steps already exist" });
    }

    // Insert all steps
    const insertedSteps = await Wudu.insertMany(wuduSteps);
    res.status(201).json({ message: "Wudu steps added successfully", data: insertedSteps });
  } catch (error) {
    res.status(400).json({ error: "Failed to add Wudu steps", details: error.message });
  }
});

// Update a Wudu step by ID - Debug version
router.put("/wudu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Updating step with ID: ${id}`);
    console.log("Update body:", req.body);
    
    // Validate that the ID exists
    const stepExists = await Wudu.findById(id);
    if (!stepExists) {
      console.log(`Step with ID ${id} not found`);
      return res.status(404).json({ error: "Wudu step not found" });
    }
    
    // Perform the update
    const updatedStep = await Wudu.findByIdAndUpdate(id, req.body, { 
      new: true,
      runValidators: true
    });
    
    console.log("Updated step:", updatedStep);
    res.json({ message: "Wudu step updated successfully", data: updatedStep });
  } catch (error) {
    console.error("Error updating step:", error);
    res.status(400).json({ 
      error: "Failed to update Wudu step", 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Delete a Wudu step by ID
router.delete("/wudu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStep = await Wudu.findByIdAndDelete(id);
    if (!deletedStep) {
      return res.status(404).json({ error: "Wudu step not found" });
    }
    res.json({ message: "Wudu step deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Wudu step", details: error.message });
  }
});

module.exports = router;