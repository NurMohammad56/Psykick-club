import { User } from "../model/user.model.js";

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};
// User register
const registerUser = async (req, res) => {
  try {
    const { email, userName, fullName, country, dob, password } = req.body;

    // Validate required fields
    if (!email || !userName || !fullName || !country || !dob || !password) {
      return res
        .status(500)
        .json({ status: false, message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(500)
        .json({ status: false, message: "User already exists." });
    }

    // Create user
    const user = await User.create({
      email,
      userName,
      fullName,
      country,
      dob,
      password,
    });

    // Remove pass from response
    const createdUser = await User.findById(user._id).select(
      "-password -tierRank -point -tmcScore -arvScore -combinedScore -leaderboardPosition -completedTargets -successRate"
    );

    return res.status(201).json({
      status: true,
      message: "User registered successfully",
      data: createdUser,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    return res
      .status(500)
      .json({ status: false, message: "Internal server error." });
  }
};

export { registerUser, generateAccessAndRefreshTokens };
