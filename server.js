const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


// require("./notificationSchedular"); 
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON body

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err); // Log error for debugging
  if (err instanceof SyntaxError) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  // Handle other types of errors
  return res.status(500).json({ error: "Internal Server Error" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Routes
const kalmaRoutes = require('./routes/ContentRoutes/kalmaRoute'); // Import the Kalma routes
const duaRoutes = require('./routes/ContentRoutes/duaRoute'); // Import the Kalma routes
const UserRoute = require('./routes/UserRoute'); // Import the User routes
const StoryRoute = require('./routes/ContentRoutes/StoryRoute'); // Import the User routes
const NamazRoute = require("./routes/ContentRoutes/namazRoutes");
const WuduRoute = require("./routes/ContentRoutes/wuduRoutes");
const AsmaulHusnaRoute = require("./routes/ContentRoutes/asmaulhusnarout");
const AsmaulNabiRoute = require("./routes/ContentRoutes/asmaulnabiroute");

//progress
const storyProgressRoute = require('./routes/ProgressRoutes/StoryProgressRoute'); // Import the Progress routes
const KalmaProgressRoute = require('./routes/ProgressRoutes/kalmaProgressRoute'); // Import the Progress routes
const duaaProgressRoute = require('./routes/ProgressRoutes/duaProgressRoute'); // Import the Progress routes
const namazProgressRoute = require('./routes/ProgressRoutes/namazProgressRoute'); // Import the Progress routes
const quizProgressRoute = require('./routes/ProgressRoutes/quizProgressRoute'); // Import the Progress routes

//quiz
const QuizRoute = require("./routes/Quiz/quizRoute");
const QuizScoreRoute = require("./routes/Quiz/quizScoreRoutes"); // Import QuizScore routes

//schedule
const scheduleRoutes = require('./routes/scheduleRoute');

//bookmark
const bookmarkRoutes = require('./routes/bookmarkRoute');


app.use('/user', UserRoute); // User API route

//content
app.use('/story', StoryRoute); // story API route
app.use('/kalma', kalmaRoutes); // Kalma API route
app.use('/dua', duaRoutes); // Kalma API route
app.use("/namaz", NamazRoute);
app.use("/wudu", WuduRoute); // Added Wudu Route
app.use("/asmaulhusna", AsmaulHusnaRoute); 
app.use("/asmaulnabi", AsmaulNabiRoute); 


//progress
app.use('/progress', storyProgressRoute); // Progress API route
app.use('/progress', KalmaProgressRoute); // Progress API route
app.use('/progress', duaaProgressRoute); // Progress API route
app.use('/progress', namazProgressRoute); // Progress API route
app.use('/progress', quizProgressRoute); // Progress API route

//quiz

app.use("/quiz", QuizRoute);
app.use("/quiz", QuizScoreRoute); 




//schedule
app.use('/schedule', scheduleRoutes);

//bookmark

app.use('/bookmarks', bookmarkRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log("Mongo URI:", process.env.MONGO_URI);

