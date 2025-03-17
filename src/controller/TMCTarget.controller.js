import { TMCTarget } from "../model/tmcTarget.model.js";

export const createTMCTarget = async (req, res) => {

    const { code, targetImage, controlImages, revealTime } = req.body;

    try {
        const newTMCTarget = new TMCTarget({ code, targetImage, controlImages, revealTime, isActive, isQueued, isCompleted });
        await newTMCTarget.save();

        return res.status(201).json({
            data: newTMCTarget,
            message: "TMCTarget created successfully"
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

export const getTMCTarget = async (req, res) => {

    const { id } = req.params;

    try {
        const TMCTarget = await TMCTarget.findById(id);
        return res.status(200).json({
            data: TMCTarget
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

export const getAllTMCTargets = async (req, res) => {

    try {
        const TMCTargets = await TMCTarget.find();
        return res.status(200).json({
            data: TMCTargets
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

export const getAllQueuedTMCTargets = async (req, res) => {

    try {
        const TMCTargets = await TMCTarget.find({ isQueued: true });
        return res.status(200).json({
            data: TMCTargets
        });
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}

export const updateTMCTargetAddToQueue = async (req, res) => {

    const { id } = req.params

    try {
        const updatedTMCTarget = await TMCTarget.findByIdAndUpdate(id, { isQueued: true }, { new: true });
        return res.status(200).json(updatedTMCTarget);
    }

    catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message
        });
    }
}