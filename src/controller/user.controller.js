import { User } from "../model/user.model.js";

// Generate access and refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error generating access and refresh tokens", error.message);
  }
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

// Login user
const loginUser = async (req, res) => {
  // get user details
  const { email, password } = req.body;

  // check email is provided or not
  if (!email) {
    return res
      .status(400)
      .json({ status: false, message: "Please provide email" });
  }

  // check if user exist or not with email
  const user = await User.findOne({
    $or: [{ email }],
  });

  // if user not found then throw error
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found with provided email",
    });
  }

  // compare the password
  const isPasswordCorrect = await user.isPasswordValid(password);
  if (!isPasswordCorrect) {
    return res.status(400).json({
      status: false,
      message: "Incorrect password",
    });
  }

  // implement access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // remove password and refreshToken filed from response
  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  res.setHeader("Authorization", `Bearer ${accessToken}`);

  return res.status(200).json({
    status: true,
    message: "User logged in successfully",
    data: loggedUser,
  });
};

// logout user
const logoutUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res
        .status(400)
        .json({ status: false, message: "User not found." });
    }

    // Remove refreshToken from the database
    await User.findByIdAndUpdate(user._id, { refreshToken: null });

    return res
      .status(200)
      .json({ status: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Error while logout: ", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export { registerUser, generateAccessAndRefreshTokens, loginUser, logoutUser };
