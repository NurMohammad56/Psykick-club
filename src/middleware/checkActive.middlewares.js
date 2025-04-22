export const updateUserActivity = async (req, res, next) => {
    if (req.user) {
      try {
        await User.findByIdAndUpdate(req.user._id, { 
          lastActive: new Date() 
        });
      } catch (error) {
        console.error("Error updating user activity:", error);
      }
    }
    next();
  };