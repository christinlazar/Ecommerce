
const User = require('../models/userModel');


const userBlockingMiddleware = async (req, res, next) => {
  try {
  
    if (req.session.user) {
      const userId = req.session.user;
      const user = await User.findById(userId);
      if (user) {
     
        if(user.is_active===false){
        req.session.destroy();
        return res.redirect('/login');
        }
      }
    }  
    next();
  } catch (error) {
    console.error('User blocking middleware error:', error);
  
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {userBlockingMiddleware};
