import { TMCTarget } from "../model/tmcTarget.model.js";

export const createTMCTarget = async (req, res, next) => {

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
        next(error);
    }
}

export const getTMCTarget = async (req, res, next) => {

    const { id } = req.params;

    try {
        const TMCTarget = await TMCTarget.findById(id);
        return res.status(200).json({
            data: TMCTarget
        });
    }

    catch (error) {
        next(error);
    }
}

export const getAllTMCTargets = async (_, res, next) => {

    try {
        const TMCTargets = await TMCTarget.find();
        return res.status(200).json({
            data: TMCTargets
        });
    }

    catch (error) {
        next(error);
    }
}

export const getAllQueuedTMCTargets = async (_, res, next) => {

    try {
        const TMCTargets = await TMCTarget.find({ isQueued: true });
        return res.status(200).json({
            data: TMCTargets
        });
    }

    catch (error) {
        next(error);
    }
}

export const updateTMCTargetAddToQueue = async (req, res, next) => {

    const { id } = req.params

    try {
        await addToQueue(id, TMCTarget, res);
    }

    catch (error) {
        next(error);
    }
}