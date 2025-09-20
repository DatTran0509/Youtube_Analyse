export const simpleAuth = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'User ID required'
      });
    }
    
    req.auth = { userId };
    req.userInfo = { userId };
    next();
  };