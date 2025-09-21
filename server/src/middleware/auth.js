import User from '../models/User.js'; // Import model User từ database

export const simpleAuth = async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID required'
      });
    }

    // Tìm user trong database dựa trên clerkUserId
    const user = await User.findOne({ clerkUserId: userId });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid User ID'
      });
    }

    // Nếu tìm thấy user, lưu thông tin user vào request
    req.auth = { userId: user.clerkUserId };
    req.userInfo = { userId: user.clerkUserId, ...user.toObject() };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};