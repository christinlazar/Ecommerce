// const User = require('../models/userModel')
// const session = require('express-session')
// const isBlock = async(req,res,next)=>{
//         try {
//             console.log("entering isblock")
//             if(req.session.user){
//              const id = req.session.user
//                 console.log(req.session.user)
//                 const blockedUser = await User.findById(id)
//                 console.log(blockedUser)
//                 if(blockedUser && blockedUser.is_active==false){
//                     console.log("entering if block")
//                      res.redirect('/')
//                      req.session.destroy();
//                 }
//             }else{
//                 next();
//             }
//         } catch (error) {
//          console.log(error);
//          res.status(500).json({ error: 'Internal Server Error' }); 
//         }
// }
// module.exports = isBlock
// Import necessary modules
const User = require('../models/userModel');

// User Blocking Middleware
const userBlockingMiddleware = async (req, res, next) => {
  try {
    // Check if the user is logged in
    if (req.session.user) {
      const userId = req.session.user;

      // Fetch user from the database
      const user = await User.findById(userId);

      // Check if the user is blocked
      if (user) {
        // If blocked, destroy the session and redirect to a blocked page
        if(user.is_active===false){
        req.session.destroy();
        return res.redirect('/login');
        }
      }
    }

    // If user is not blocked or not logged in, proceed to the next middleware
    next();
  } catch (error) {
    console.error('User blocking middleware error:', error);
    // Handle the error as needed
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Export the middleware
module.exports = {userBlockingMiddleware};
