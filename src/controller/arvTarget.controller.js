import { ARVTarget } from "../model/ARVTarget.model.js";

export const createARVTarget = async (req, res) => {

    const { code, eventName, eventDescription, revealTime, outcomeTime, image1, image2, image3, controlImage } = req.body;

    try {

        const newARVTarget = new ARVTarget({ code, eventName, eventDescription, revealTime, outcomeTime, image1, image2, image3, controlImage })

        await newARVTarget.save()

        return res.status(201).json({
            data: newARVTarget,
            message: "ARV Target created successfully"
        })
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const getARVTarget = async (req, res) => {

    const { id } = req.params;

    try {

        const arvTarget = await ARVTarget.findById(id).select("-__v");

        if (!arvTarget) {
            return res.status(404).json({ message: "ARV Target not found" });
        }

        return res.status(200).json({ data: arvTarget });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const getAllARVTargets = async (req, res) => {

    try {
        const ARVTargets = await ARVTarget.find().select("-__v");
        return res.status(200).json({ data: ARVTargets })
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const getAllQueuedARVTargets = async (req, res) => {

    try {
        const ARVTargets = await ARVTarget.find({ isQueued: true }).select("-__v");
        return res.status(200).json({ data: ARVTargets })
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const updateUserSubmission = async (req, res) => {

    const { id } = req.params;
    const { userSubmittedImage } = req.body;

    try {
        const updatedARVTarget = await ARVTarget.findByIdAndUpdate(id, { userSubmittedImage }, { new: true }).select("-__v")

        if (!updatedARVTarget) {
            return res.status(404).json({ message: "ARV Target not found" });
        }

        return res.status(200).json({
            data: updatedARVTarget,
            message: "User submitted image successfully"
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const updateResultImage = async (req, res) => {

    const { id } = req.params;
    const { resultImage } = req.body;

    try {
        await ARVTarget.findByIdAndUpdate(id, { resultImage });
        return res.status(200).json({ message: "Result image updated successfully" });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const addToQueue = async (req, res) => {

    const { id } = req.params;

    try {
        await ARVTarget.findByIdAndUpdate(id, { isQueued: true })
        return res.status(200).json({ message: "ARV Target added to queue successfully" })
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}