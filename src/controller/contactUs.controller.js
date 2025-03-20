import { ContactUs } from "../model/contactUs.model.js";

const createContactUs = async (req, res, next) => {
  try {
    const {name, email, subject, message} = req.body;
    const userId = req.user._id;

    if (!req.body) {
      return res
        .status(400)
        .json({ status: false, message: "You must be fillup everything" });
    }

    const createContact = await ContactUs({
      userId: userId,
      name,
      email,
      subject,
      message,
    });
    await createContact.save();

    if (!createContact) {
      return res
        .status(400)
        .json({ status: false, message: "Contact us creation failed" });
    }

    return res.status(201).json({
      status: true,
      message: "Contact us creation successful",
      data: createContact,
    });
  } catch (error) {
    console.log("object");
    next(error);
  }
};

export { createContactUs };
