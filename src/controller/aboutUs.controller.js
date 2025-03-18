import { AboutUs } from "../model/aboutUs.model.js";

// Create About Us content from admin
const createAboutUs = async (req, res, next) => {
  try {
    const aboutUs = new AboutUs(req.body);
    await aboutUs.save();
    res
      .status(201)
      .json({ status: true, message: "About Us created", data: aboutUs });
  } catch (error) {
    next(error);
  }
};

// Get About Us content from admin
const getAboutUs = async (req, res, next) => {
  try {
    const aboutUs = await AboutUs.findOne();
    if (!aboutUs)
      return res
        .status(404)
        .json({ success: false, message: "About Us not found" });
    return res
      .status(200)
      .json({
        status: true,
        message: "About us fetched successfully",
        data: aboutUs,
      });
  } catch (error) {
    next(error);
  }
};

// Update About Us content
const updateAboutUs = async (req, res, next) => {
  try {
    const { id } = req.params.id;
    const aboutUs = await AboutUs.findOneAndUpdate({ id }, req.body, {
      new: true,
    });
    if (!aboutUs)
      return res
        .status(404)
        .json({ status: false, message: "About Us not found" });
    return res
      .status(200)
      .json({ status: true, message: "About Us updated", data: aboutUs });
  } catch (error) {
    next(error);
  }
};

// Delete About Us content
const deleteAboutUs = async (req, res, next) => {
  try {
    const { id } = req.params.id;
    await AboutUs.findByIdAndDelete(id);
    return res.status(200).json({ status: true, message: "About Us deleted" });
  } catch (error) {
    next(error);
  }
};

export { createAboutUs, getAboutUs, updateAboutUs, deleteAboutUs };
