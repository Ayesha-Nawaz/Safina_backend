const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); // Import User model
const router = express.Router();
const authenticateJWT = require("../middleware/jwttoken"); // Correct the path if needed
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, gender, age, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // List of emails that should automatically be assigned the admin role
    const adminEmails = ["ayeshanawaz211288@gmail.com", "avae1856@gmail.com","arhamaleem103@gmail.com"]; // Replace with your desired admin emails

    // Assign role based on email or request
    let assignedRole = "user"; // Default role
    if (adminEmails.includes(email)) {
      assignedRole = "admin"; // Assign admin role if the email matches
    } else if (role) {
      const validRoles = ["user", "admin"];
      assignedRole = validRoles.includes(role) ? role : "user"; // Validate provided role
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      gender,
      age,
      role: assignedRole,
    });

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      "JWTSECRET",
      { expiresIn: "24h" }
    );

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error("Error in signup:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Check if the email belongs to an admin
    const adminEmails = [
      "ayeshanawaz211288@gmail.com",
      "avae1856@gmail.com",
      "arhamaleem103@gmail.com",
    ];
    if (adminEmails.includes(email) && user.role !== "admin") {
      // Update the user's role to admin in the database
      user.role = "admin";
      await user.save();
    }

    // Generate JWT token with userId and role
    const token = jwt.sign({ userId: user._id, role: user.role }, "JWTSECRET", {
      expiresIn: "24h",
    });

    // ✅ Include userId in the response
    res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// get single user
router.get("/auser/:id", authenticateJWT, async (req, res) => {
  try {
    // Find the user based on the userId stored in the JWT token
    const user = await User.findById(req.user.userId).select("-password"); // Exclude password from response

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users
router.get("/allusers", async (req, res) => {
  try {
    // Fetch all users from the database, excluding passwords
    const users = await User.find().select("-password"); // The '-password' part excludes the password field from the response

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Update User route
router.put("/update/:id", authenticateJWT, async (req, res) => {
  try {
    const { username, email, gender, age } = req.body;

    // Check if the user ID in the URL matches the authenticated user ID
    if (req.user.userId !== req.params.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this user" });
    }

    // Find the user by ID
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update the user fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.gender = gender || user.gender;
    user.age = age || user.age;

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error during update:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete User route
router.delete("/delete/:id", authenticateJWT, async (req, res) => {
  try {
    // Find the user by ID and delete it
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Forget password - Generate and send verification code
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpiry = Date.now() + 300000; // Valid for 5 minutes

    // Save code and expiry in DB
    user.verificationCode = verificationCode;
    user.codeExpiry = codeExpiry;
    await user.save();

    // Setup transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email content with user's name
    const mailOptions = {
      to: user.email,
      subject: "Your Password Reset Verification Code",
      text: `
Dear ${user.name || "User"},

We received a request to reset your password for your Safina account. To proceed, please use the verification code provided below:

🔐 Verification Code: ${verificationCode}

This code is valid for 5 minutes.

Regards, 

Safina  Team
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Verification code sent to your email" });
  } catch (error) {
    console.error("Error in forgotpassword route:", error);
    res.status(500).json({ message: "Error processing request", error: error.message || error });
  }
});

// Verify the code entered by the user
// Verify the code entered by the user
router.post("/verifycode", async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Ensure verificationCode is a string and remove any extra spaces
    const storedCode = user.verificationCode ? String(user.verificationCode).trim() : null;
    const receivedCode = String(verificationCode).trim();

    // Check if the verification code matches
    if (!storedCode || storedCode !== receivedCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Check if the verification code has expired (5 minutes in this case)
    if (Date.now() > user.codeExpiry) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // If the code is valid and not expired
    res.status(200).json({ message: "Code verified successfully" });
  } catch (error) {
    console.error("Error in verifycode route:", error);
    res.status(500).json({ message: "Error processing request", error: error.message || error });
  }
});




// Reset password
router.post("/resetpassword", async (req, res) => {
  const { verificationCode, newPassword } = req.body;

  try {
    // Find the user using only the verificationCode
    const user = await User.findOne({ verificationCode });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure verification code is valid
    if (Date.now() > user.codeExpiry) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password and clear verification data
    user.password = hashedPassword;
    user.verificationCode = undefined;
    user.codeExpiry = undefined;

    await user.save();
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password", error: error.message || error });
  }
});


//==============================================================================================
//=========================================FOR ADMMIN===========================================
//==============================================================================================


// Get user statistics by month
router.get('/users-monthly', async (req, res) => {
  try {
    // Get current date and calculate 12 months back
    const currentDate = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(currentDate.getMonth() - 11);
    twelveMonthsAgo.setDate(1);
    twelveMonthsAgo.setHours(0, 0, 0, 0);

    // Aggregate users by month
    const monthlyStats = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    // Create array of all months for the last 12 months
    const months = [];
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        monthName: monthNames[date.getMonth()],
        count: 0
      });
    }

    // Map the actual data to months array
    monthlyStats.forEach(stat => {
      const monthIndex = months.findIndex(m => 
        m.year === stat._id.year && m.month === stat._id.month
      );
      if (monthIndex !== -1) {
        months[monthIndex].count = stat.count;
      }
    });

    // Format data for frontend
    const chartData = months.map(month => ({
      month: month.monthName,
      users: month.count,
      fullDate: `${month.monthName} ${month.year}`
    }));

    res.json({
      success: true,
      data: chartData
    });

  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
});

// Get overall stats
router.get('/overview', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Users registered this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const thisMonthUsers = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        adminUsers,
        thisMonthUsers
      }
    });

  } catch (error) {
    console.error('Error fetching overview stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overview statistics',
      error: error.message
    });
  }
});




module.exports = router;
