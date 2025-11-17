import { User, MiningSession, Config } from '../models/index.js';

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, activeSessions, totalSessions, totalTokensMined, config] = await Promise.all([
      User.countDocuments(),
      MiningSession.countDocuments({ status: 'mining' }),
      MiningSession.countDocuments(),
      MiningSession.aggregate([
        { $match: { status: 'claimed' } },
        { $group: { _id: null, total: { $sum: '$totalEarned' } } }
      ]),
      Config.findOne({ key: 'mining_config' })
    ]);

    const stats = {
      totalUsers,
      activeSessions,
      totalSessions,
      totalTokensMined: totalTokensMined[0]?.total || 0,
      config: config ? {
        baseRate: config.baseRate,
        durationsCount: config.durations.length,
        multipliersCount: config.multiplierOptions.length
      } : null,
      timestamp: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics' });
  }
};

// Get All Users
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Build search query
    const searchQuery = search
      ? { walletAddress: { $regex: search, $options: 'i' } }
      : {};

    const [users, totalUsers] = await Promise.all([
      User.find(searchQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(searchQuery)
    ]);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Get User Details
export const getUserDetails = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const [user, miningSessions] = await Promise.all([
      User.findOne({ walletAddress }).lean(),
      MiningSession.find({ wallet: walletAddress })
        .sort({ createdDate: -1 })
        .limit(20)
        .lean()
    ]);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate user statistics
    const totalSessions = miningSessions.length;
    const activeSessions = miningSessions.filter(s => s.status === 'mining').length;
    const completedSessions = miningSessions.filter(s => s.status === 'claimed').length;
    const totalEarned = miningSessions
      .filter(s => s.status === 'claimed')
      .reduce((sum, s) => sum + s.totalEarned, 0);

    res.json({
      user,
      statistics: {
        totalSessions,
        activeSessions,
        completedSessions,
        totalEarned
      },
      recentSessions: miningSessions
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};

// Get All Mining Sessions
export const getAllMiningSessions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const wallet = req.query.wallet;
    const skip = (page - 1) * limit;

    // Build filter query
    const filterQuery = {};
    if (status && ['mining', 'claimed', 'cancelled'].includes(status)) {
      filterQuery.status = status;
    }
    if (wallet) {
      filterQuery.wallet = { $regex: wallet, $options: 'i' };
    }

    const [sessions, totalSessions] = await Promise.all([
      MiningSession.find(filterQuery)
        .sort({ createdDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MiningSession.countDocuments(filterQuery)
    ]);

    res.json({
      sessions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalSessions / limit),
        totalSessions,
        hasNext: page * limit < totalSessions,
        hasPrev: page > 1
      },
      filters: {
        status,
        wallet
      }
    });
  } catch (error) {
    console.error('Get mining sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch mining sessions' });
  }
};

// Get Analytics Data
export const getAnalytics = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // User registration over time
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Mining sessions over time - parse DD/MM/YYYY HH:mm:ss format manually
    // Since createdDate is stored as string in DD/MM/YYYY format, we'll fetch and parse in JavaScript
    const allSessions = await MiningSession.find().lean();
    
    // Parse dates and filter by time range
    const sessionsInRange = allSessions.filter(session => {
      try {
        // Parse DD/MM/YYYY HH:mm:ss format
        const parts = session.createdDate.split(' ');
        const dateParts = parts[0].split('/');
        const timeParts = parts[1]?.split(':') || ['0', '0', '0'];
        
        // Create date object (month is 0-indexed in JS)
        const sessionDate = new Date(
          parseInt(dateParts[2]), // year
          parseInt(dateParts[1]) - 1, // month (0-indexed)
          parseInt(dateParts[0]), // day
          parseInt(timeParts[0]), // hour
          parseInt(timeParts[1]), // minute
          parseInt(timeParts[2]) // second
        );
        
        return sessionDate >= startDate;
      } catch (e) {
        return false;
      }
    });

    // Group by date
    const miningActivityMap = {};
    sessionsInRange.forEach(session => {
      try {
        const parts = session.createdDate.split(' ');
        const dateParts = parts[0].split('/');
        const year = parseInt(dateParts[2]);
        const month = parseInt(dateParts[1]);
        const day = parseInt(dateParts[0]);
        
        const key = `${year}-${month}-${day}`;
        if (!miningActivityMap[key]) {
          miningActivityMap[key] = {
            _id: { year, month, day },
            sessions: 0,
            tokensEarned: 0
          };
        }
        
        miningActivityMap[key].sessions += 1;
        if (session.status === 'claimed') {
          miningActivityMap[key].tokensEarned += session.totalEarned;
        }
      } catch (e) {
        // Skip invalid dates
      }
    });

    const miningActivity = Object.values(miningActivityMap).sort((a, b) => {
      if (a._id.year !== b._id.year) return a._id.year - b._id.year;
      if (a._id.month !== b._id.month) return a._id.month - b._id.month;
      return a._id.day - b._id.day;
    });

    // Status distribution
    const statusDistribution = await MiningSession.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Multiplier usage distribution
    const multiplierDistribution = await MiningSession.aggregate([
      {
        $group: {
          _id: '$multiplier',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id': 1 }
      }
    ]);

    // Top users by tokens
    const topUsers = await User.find()
      .sort({ totalTokens: -1 })
      .limit(10)
      .lean();

    // Average session duration
    const avgSessionDuration = await MiningSession.aggregate([
      {
        $group: {
          _id: null,
          avgHours: { $avg: '$selectedHour' }
        }
      }
    ]);

    res.json({
      userGrowth,
      miningActivity,
      statusDistribution,
      multiplierDistribution,
      topUsers,
      avgSessionDuration: avgSessionDuration[0]?.avgHours || 0,
      period: {
        days,
        startDate,
        endDate: new Date()
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics data' });
  }
};

// Get Config
export const getConfig = async (req, res) => {
  try {
    const config = await Config.findOne({ key: 'mining_config' });
    
    if (!config) {
      return res.status(404).json({ message: 'Config not found' });
    }

    res.json(config);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ message: 'Failed to fetch config' });
  }
};

// Process Payment
export const processPayment = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    const { amount } = req.body;

    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user has enough tokens
    if (user.totalTokens < amount) {
      return res.status(400).json({ 
        message: 'Insufficient tokens',
        available: user.totalTokens,
        requested: amount
      });
    }

    // Simulate payment processing
    const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Update user payment status
    user.paymentStatus = 'completed';
    user.lastPaymentDate = new Date();
    user.totalPaid = (user.totalPaid || 0) + amount;
    
    // Add to payment history
    if (!user.paymentHistory) {
      user.paymentHistory = [];
    }
    user.paymentHistory.push({
      amount,
      status: 'completed',
      date: new Date(),
      transactionId
    });

    await user.save();

    res.json({
      success: true,
      message: 'Payment processed successfully',
      transactionId,
      user: {
        walletAddress: user.walletAddress,
        totalTokens: user.totalTokens,
        totalPaid: user.totalPaid,
        paymentStatus: user.paymentStatus,
        lastPaymentDate: user.lastPaymentDate
      }
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ message: 'Failed to process payment' });
  }
};

// Get Payment History
export const getPaymentHistory = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const user = await User.findOne({ walletAddress }).lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      walletAddress: user.walletAddress,
      totalPaid: user.totalPaid || 0,
      paymentStatus: user.paymentStatus || 'pending',
      lastPaymentDate: user.lastPaymentDate,
      paymentHistory: user.paymentHistory || []
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Failed to fetch payment history' });
  }
};
