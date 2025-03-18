import { TMCTarget } from "../model/tmcTarget.model.js";
import { addToQueue } from "../utils/addToQueue.js";
import { generateCode } from "../utils/generateCode.js";
import { removeFromQueue } from "../utils/removeFromQueue.js";

export const createTMCTarget = async (req, res, next) => {

    const { targetImage, controlImages, revealTime, bufferTime, gameTime } = req.body;

    try {
        const code = generateCode();
        const newTMCTarget = new TMCTarget({ code, targetImage, controlImages, revealTime, bufferTime, gameTime });
        await newTMCTarget.save();

        return res.status(201).json({
            message: "TMCTarget created successfully"
        });
    }

    catch (error) {
        next(error);
    }
}

// export const getTMCTarget = async (req, res, next) => {

//     const { id } = req.params;

//     try {
//         const tmcTarget = await TMCTarget.findById(id).select("-isActive -isQueued -isCompleted -createdAt -updatedAt -__v");
//         return res.status(200).json({
//             data: tmcTarget
//         });
//     }

//     catch (error) {
//         next(error);
//     }
// }

export const getAllTMCTargets = async (_, res, next) => {

    try {
        const TMCTargets = await TMCTarget.find().select("-targetImage -controlImages -__v");
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
        const TMCTargets = await TMCTarget.find({ isQueued: true }).select("-targetImage -controlImages -__v");
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

export const updateTMCTargetRemoveFromQueue = async (req, res, next) => {

    const { id } = req.params

    try {
        await removeFromQueue(id, TMCTarget, res);
    }

    catch (error) {
        next(error);
    }
}

export const updateTMCTargetBufferTime = async (req, res, next) => {

    const { id } = req.params;
    const { bufferTime } = req.body;

    try {
        await TMCTarget.findByIdAndUpdate(id, { bufferTime }, { new: true });
        return res.status(200).json({
            message: "Buffer time updated successfully"
        });
    }

    catch (error) {
        next(error);
    }
}

export const updateTMCTargetGameTime = async (req, res, next) => {

    const { id } = req.params;
    const { gameTime } = req.body;

    try {
        await TMCTarget.findByIdAndUpdate(id, { gameTime }, { new: true });
        return res.status(200).json({
            message: "Game time updated successfully"
        });
    }

    catch (error) {
        next(error);
    }
}