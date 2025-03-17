import mongoose from "mongoose";
import { generateAccessAndRefreshTokens } from "../controller/user.controller.js";
import { User } from "../model/user.model.js";
import { sendMail } from "../utils/email.util.js";
import { generateOTP } from "../utils/otp.util.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { deleteFromCloudinary } from "../utils/cloudinaryDestroy.util.js";

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

// Sent otp in email
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ status: false, message: "Email is required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Generate a random 6-digit otp
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // set the otp in database
    user.otp = otp;
    user.otpExpiration = otpExpires;
    await user.save();

    // Send the OTP to the users
    await sendMail(email, otp);

    return res.status(201).json({
      status: true,
      message: "Your OTP has been sent",
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Vrify OTP
const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    // check the user and the otp is inalid or expire
    const user = await User.findOne({ otp });
    if (user.otp !== otp || new Date() > user.otpExpiration) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid or expired OTP" });
    }

    // If verified then undefine otp details from database
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ status: true, message: "OTP verified successfully" });
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required to resend OTP",
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Generate new OTP and expiration time
    const newOtp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    // Update OTP in the database
    user.otp = newOtp;
    user.otpExpiration = otpExpires;
    await user.save();

    await sendMail(user.email, newOtp);

    return res.status(200).json({
      status: true,
      message: "OTP has been resent successfully",
    });
  } catch (error) {
    console.error("Error while resending OTP:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

// Reset pass
const resetPassword = async (req, res) => {
  try {
    const { newPassword, confirmPassword } = req.body;

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // check if new password and confirm new password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        status: false,
        message: "New password and confirm new password does not match",
      });
    }

    // update the password
    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error while reseting password: ", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const updateAdminProfile = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const adminId = req.user._id;
    const { fullName, phoneNumber, country, city, streetAddress, about } =
      req.body;

    // Find admin and ensure they are authorized
    const admin = await User.findOne({ _id: adminId, role: "admin" }).session(
      session
    );
    if (!admin) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(403)
        .json({ status: false, message: "Unauthorized access" });
    }

    // Update fields dynamically
    const fieldsToUpdate = {
      fullName,
      phoneNumber,
      country,
      city,
      streetAddress,
      about,
    };
    for (const [key, value] of Object.entries(fieldsToUpdate)) {
      if (value) admin[key] = value;
    }

    // Update avatar if a new image is uploaded
    if (req.file) {
      const cloudinaryUpload = await uploadOnCloudinary(req.file.buffer, {
        resource_type: "auto",
      });

      // Delete old Cloudinary image if exists
      if (admin.avatar) {
        const publicId = admin.avatar.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }

      admin.avatar = cloudinaryUpload.secure_url;
    }

    // Save updated admin profile
    const updatedProfile = await admin.save({ session });

    // Commit transaction when all changes made
    await session.commitTransaction();
    session.endSession();

    // Remove extra fields before returning
    const profile = await User.findById(updatedProfile._id).select(
      "-dob -password -tierRank -point -tmcScore -arvScore -combinedScore -leaderboardPosition -completedTargets -successRate -emailVerified -role -refreshToken"
    );

    return res.status(200).json({
      status: true,
      message: "Profile updated successfully",
      updatedProfile: profile,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    session.endSession();
    next(error);
  }
};

const changePasswordAdmin = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    const adminId = req.user._id;
    const admin = await User.findById(adminId);

    if (!admin) {
      return res.status(404).json({
        status: false,
        message: "Admin not found",
      });
    }

    // check the pass
    const isMatch = await admin.isPasswordValid(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        status: false,
        message: "Incorrect current password",
      });
    }

    // check if new password and confirm new password match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        status: false,
        message: "New password and confirm new password does not match",
      });
    }

    // update the password
    admin.password = newPassword;
    await admin.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log("Error while changing password: ", error);
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};
export {
  adminLogin,
  forgotPassword,
  verifyOtp,
  resendOTP,
  resetPassword,
  updateAdminProfile,
  changePasswordAdmin
};
