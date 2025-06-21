const express = require("express");
const UserActivity = require("../models/useractivitymodel");
const User = require("../models/UserModel");
const authenticateJWT = require("../middleware/jwttoken");
const router = express.Router();

// Helper function to track user activity
const trackActivity = async (userId, activityType, additionalData = {}) => {
  try {
    const activity = new UserActivity({
      userId,
      activityType,
      additionalData
    });
    await activity.save();
  } catch (error) {
    console.error('Error tracking activity:', error);
  }
};

// Get user activity analytics for admin dashboard
router.get('/dashboard-analytics', authenticateJWT, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfLastMonth = new Date(currentYear, currentMonth, 0);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total users
    const totalUsers = await User.countDocuments({ role: 'user' });

    // Users signed up this month
    const newUsersThisMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfMonth }
    });

    // Users signed up last month
    const newUsersLastMonth = await User.countDocuments({
      role: 'user',
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    // Active users (logged in within last 30 days)
    const activeUserIds = await UserActivity.distinct('userId', {
      activityType: 'login',
      timestamp: { $gte: thirtyDaysAgo }
    });
    const activeUsersCount = activeUserIds.length;

    // Active users this week
    const activeUsersThisWeek = await UserActivity.distinct('userId', {
      activityType: 'login',
      timestamp: { $gte: sevenDaysAgo }
    }).then(ids => ids.length);

    // Monthly user growth for last 6 months
    const monthlyGrowth = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(currentYear, currentMonth - i, 1);
      const monthEnd = new Date(currentYear, currentMonth - i + 1, 0);
      
      const usersInMonth = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: monthStart, $lte: monthEnd }
      });

      monthlyGrowth.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        users: usersInMonth,
        monthStart: monthStart,
        monthEnd: monthEnd
      });
    }

    // Weekly activity data
    const weeklyActivity = [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const activeUsers = await UserActivity.distinct('userId', {
        activityType: 'login',
        timestamp: { $gte: dayStart, $lte: dayEnd }
      }).then(ids => ids.length);

      weeklyActivity.push({
        day: daysOfWeek[dayStart.getDay() === 0 ? 6 : dayStart.getDay() - 1],
        date: dayStart.toISOString().split('T')[0],
        activeUsers
      });
    }

    // User retention rate (users who signed up last month and are still active)
    const lastMonthNewUsers = await User.find({
      role: 'user',
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    }).select('_id');

    const retainedUsers = await UserActivity.distinct('userId', {
      userId: { $in: lastMonthNewUsers.map(u => u._id) },
      activityType: 'login',
      timestamp: { $gte: startOfMonth }
    }).then(ids => ids.length);

    const retentionRate = newUsersLastMonth > 0 ? (retainedUsers / newUsersLastMonth * 100).toFixed(1) : 0;

    // Most active users this month
    const mostActiveUsers = await UserActivity.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfMonth },
          activityType: 'login'
        }
      },
      {
        $group: {
          _id: '$userId',
          loginCount: { $sum: 1 },
          lastLogin: { $max: '$timestamp' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $match: {
          'userInfo.role': 'user'
        }
      },
      {
        $project: {
          userId: '$_id',
          username: '$userInfo.username',
          email: '$userInfo.email',
          loginCount: 1,
          lastLogin: 1
        }
      },
      {
        $sort: { loginCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.json({
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      activeUsersCount,
      activeUsersThisWeek,
      retentionRate: parseFloat(retentionRate),
      monthlyGrowth,
      weeklyActivity,
      mostActiveUsers,
      growthRate: newUsersLastMonth > 0 ? 
        (((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100).toFixed(1) : 
        newUsersThisMonth > 0 ? 100 : 0
    });

  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Get detailed user activity
router.get('/user/:userId', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, activityType, startDate, endDate } = req.query;

    // Build query
    const query = { userId };
    
    if (activityType) {
      query.activityType = activityType;
    }
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const activities = await UserActivity.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'username email');

    const totalActivities = await UserActivity.countDocuments(query);

    res.json({
      activities,
      totalPages: Math.ceil(totalActivities / limit),
      currentPage: page,
      totalActivities
    });

  } catch (error) {
    console.error('Error fetching user activities:', error);
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
});

// Get activity summary for a specific user
router.get('/user/:userId/summary', authenticateJWT, async (req, res) => {
  try {
    const { userId } = req.params;
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const summary = await UserActivity.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(userId),
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 },
          lastActivity: { $max: '$timestamp' }
        }
      }
    ]);

    const totalActivities = summary.reduce((sum, item) => sum + item.count, 0);
    const lastLogin = await UserActivity.findOne({
      userId,
      activityType: 'login'
    }).sort({ timestamp: -1 });

    res.json({
      userId,
      summary,
      totalActivities,
      lastLogin: lastLogin?.timestamp || null
    });

  } catch (error) {
    console.error('Error fetching user activity summary:', error);
    res.status(500).json({ error: 'Failed to fetch activity summary' });
  }
});

// Track activity endpoint (can be called from frontend)
router.post('/track', authenticateJWT, async (req, res) => {
  try {
    const { activityType, additionalData = {} } = req.body;
    const userId = req.user.userId;

    const activity = new UserActivity({
      userId,
      activityType,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      additionalData
    });

    await activity.save();
    res.json({ message: 'Activity tracked successfully' });

  } catch (error) {
    console.error('Error tracking activity:', error);
    res.status(500).json({ error: 'Failed to track activity' });
  }
});

// Export the trackActivity helper function for use in other routes
module.exports = { router, trackActivity };