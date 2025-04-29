import { User } from "../model/user.model.js";

export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id).select(
      "-fullName -phone -sessions -title -country -dob -password -point -tmcScore -arvScore -combinedScore -leaderboardPosition -emailVerified -role -gender -refreshToken -otpExpiration -createdAt -updatedAt -__v"
    );

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const updateUserProfile = async (req, res) => {
  const userId = req.user._id;
  const { screenName, fullName, phoneNumber, country, dob, gender } = req.body;

  try {
    // const user = await User.findById(userId);

    // if (user && user._id.toString() !== userId) {
    //   return res
    //     .status(400)
    //     .json({ status: false, message: "Screen name already exists" });
    // }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { screenName, fullName, phoneNumber, country, dob, gender },
      { new: true }
    ).select(
      "-title -password -tierRank -point -tmcScore -arvScore -combinedScore -leaderboardPosition -completedTargets -successRate -emailVerified -role -refreshToken -otpExpiration -createdAt -updatedAt -__v"
    );

    // Define fields to check for completeness
    const fieldsToCheck = [
      'screenName',
      'fullName',
      'phoneNumber',
      'country',
      'dob',
      'gender',
    ];

    let completedFields = 0;

    fieldsToCheck.forEach(fieldPath => {
      const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], updatedUser);
      if (value) completedFields++;
    });

    const completeness = Math.round((completedFields / fieldsToCheck.length) * 100);

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      data: updatedUser,
      completeness,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

export const getProfileCompleteness = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await User.findById(userId).select('screenName fullName phoneNumber country dob gender');

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const fieldsToCheck = ['screenName', 'fullName', 'phoneNumber', 'country', 'dob', 'gender'];
    const completedFields = fieldsToCheck.filter(field => !!profile[field]).length;
    const completeness = Math.round((completedFields / fieldsToCheck.length) * 100);

    return res.status(200).json({ completeness }); 
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const updateUserPassword = async (req, res) => {
  const { newPassword } = req.body;
  const id = req.user._id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};
