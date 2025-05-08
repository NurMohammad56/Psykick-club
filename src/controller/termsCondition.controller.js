import { TermsCondition } from "../model/termsCondition.model.js";

// Create Terms & Condition from admin
const createTermsCondition = async (req, res, next) => {
  const { content } = req.body;
  try {
    if (!content) {
      return res
        .status(400)
        .json({ status: false, message: "Content is required" });
    }

    const newTermsCondition = new TermsCondition({ content });

    await newTermsCondition.save();

    return res.status(201).json({
      status: true,
      message: "Terms & Condition is created successfully",
      data: newTermsCondition,
    });
  }

  catch (error) {
    next(error);
  }
};

// Get Terms & Condition from admin
const getTermsCondition = async (req, res, next) => {
  const { id } = req.params;
  try {
    const termsCondition = await TermsCondition.findById(id)
    return res.status(200).json({
      status: true,
      message: "Terms & Condition fetched successfully",
      data: termsCondition,
    });
  } catch (error) {
    next(error);
  }
};

// Update Terms & Condition from admin
const updateTermsCondition = async (req, res, next) => {
  const { content } = req.body;
  const { id } = req.params;
  try {
    if (!content) {
      return res
        .status(400)
        .json({ status: false, message: "Content is required" });
    }
    const termsCondition = await TermsCondition.findById(id);
    if (!termsCondition) {
      return res
        .status(404)
        .json({ status: false, message: "Terms & Condition not found" });
    }
    termsCondition.content = content;
    await termsCondition.save();
    return res.status(200).json({
      status: true,
      message: "Terms & Condition is updated successfully",
      data: termsCondition,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createTermsCondition,
  getTermsCondition,
  updateTermsCondition
};
