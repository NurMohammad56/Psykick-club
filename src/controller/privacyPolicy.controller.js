import { PrivacyPolicy } from "../model/privacyPolicy.model.js";

// Create privacy policy from admin

const createPrivacyPolicy = async (req, res, next) => {
  const { content } = req.body;
  try {
    if (!content) {
        return res.status(400).json({status: false, message: "Content is required" });
      }
    const newPrivacyPolicy = new PrivacyPolicy({ content });


    await newPrivacyPolicy.save();

    return res.status(201).json({status: true, message: "Privacy policy is created successfully", data: newPrivacyPolicy });
  } catch (error) {
    next(error);
  }
};

// Get privacy policies from admin
const getPrivacyPolicies = async (_, res, next) => {
  try {
    const privacyPolicies = await PrivacyPolicy.find({});
    return res.status(200).json({ status: true, message: "Privacy policy fetched successfully", data: privacyPolicies });
  } catch (error) {
    next(error);
  }
};

export { createPrivacyPolicy, getPrivacyPolicies}
