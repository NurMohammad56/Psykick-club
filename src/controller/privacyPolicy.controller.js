import { PrivacyPolicy } from "../model/privacyPolicy.model.js";

// Create privacy policy from admin

const createPrivacyPolicy = async (req, res, next) => {
  const { content } = req.body;
  try {
    if (!content) {
      return res
        .status(400)
        .json({ status: false, message: "Content is required" });
    }

    const newPrivacyPolicy = new PrivacyPolicy({ content });

    await newPrivacyPolicy.save();

    return res.status(201).json({
      status: true,
      message: "Privacy policy is created successfully",
      data: newPrivacyPolicy,
    });
  } catch (error) {
    next(error);
  }
};

// Get privacy policies from admin
const getPrivacyPolicies = async (req, res, next) => {
  const { id } = req.params;
  try {
    const privacyPolicies = await PrivacyPolicy.findById(id);
    return res.status(200).json({
      status: true,
      message: "Privacy policy fetched successfully",
      data: privacyPolicies,
    });
  } catch (error) {
    next(error);
  }
};

// Update privacy policy from admin
const updatePrivacyPolicy = async (req, res, next) => {
  const { content } = req.body;
  const { id } = req.params;
  try {
    if (!content) {
      return res
        .status(400)
        .json({ status: false, message: "Content is required" });
    }
    const privacyPolicy = await PrivacyPolicy.findById(id);
    if (!privacyPolicy) {
      return res
        .status(404)
        .json({ status: false, message: "Privacy policy not found" });
    }
    privacyPolicy.content = content;
    await privacyPolicy.save();
    return res.status(200).json({
      status: true,
      message: "Privacy policy is updated successfully",
      data: privacyPolicy,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createPrivacyPolicy,
  getPrivacyPolicies,
  updatePrivacyPolicy
};
