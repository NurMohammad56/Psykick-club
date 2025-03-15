import {generateAccessAndRefreshTokens} from "../controller/user.controller.js"
import {User} from "../model/user.model.js"

// Admin login controller
const adminLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email, role: "admin" });
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "Admin not found" });
      }
  
      const isPasswordValid = await user.isPasswordValid(password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ status: false, message: "Password invalid" });
      }
  
      const { accessToken } = await generateAccessAndRefreshTokens(user._id);
  
      await user.save();
  
      res.setHeader("Authorization", `Bearer ${accessToken}`);
  
      return res.status(200).json({
        status: true,
        message: "Admin login successful",
        accessToken,
      });
    } catch (error) {
      console.log("Error while login in admin dashboard: ", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  };

  export { adminLogin };