import { ARVTarget } from "../model/ARVTarget.model.js";
import { TMCTarget } from "../model/tmcTarget.model.js";
import { addToQueue } from "../utils/addToQueue.js";
import { generateCode } from "../utils/generateCode.js";
import { removeFromQueue } from "../utils/removeFromQueue.js";

export const createARVTarget = async (req, res, next) => {

    const { eventName, eventDescription, revealTime, outcomeTime, bufferTime, gameTime, image1, image2, image3, controlImage } = req.body;

    try {

        let code;
        let arvCode, tmcCode;

        do {
            code = generateCode()

            arvCode = await ARVTarget.findOne({ code })
            tmcCode = await TMCTarget.findOne({ code })

        } while (arvCode || tmcCode)

        if (new Date(revealTime).getTime() < new Date(gameTime).getTime()) {
            return res.status(400).json({
                message: "Reveal time should be in the future or equal to game time"
            });
        }

        else if (new Date(revealTime).getTime() >= new Date(outcomeTime).getTime()) {
            return res.status(400).json({ message: "Outcome time should be in the future of reveal time" })
        }

        else if (new Date(outcomeTime).getTime() > new Date(bufferTime).getTime()) {
            return res.status(400).json({ message: "Buffer time should be in the future or equal to outcome time" })
        }

        const newARVTarget = new ARVTarget({ code, eventName, eventDescription, revealTime, outcomeTime, bufferTime, gameTime, image1, image2, image3, controlImage });

        await newARVTarget.save();

        return res.status(201).json({
            data: newARVTarget,
            message: "ARV Target created successfully"
        });
    }

    catch (error) {
        next(error);
    }
}

// export const getARVTarget = async (req, res, next) => {

//     const { id } = req.params;

//     try {

//         const arvTarget = await ARVTarget.findById(id).select("-__v");

//         if (!arvTarget) {
//             return res.status(404).json({ message: "ARV Target not found" });
//         }

//         return res.status(200).json({ data: arvTarget });
//     }

//     catch (error) {
//         next(error);
//     }
// }

export const getAllARVTargets = async (_, res, next) => {

    try {
        const ARVTargets = await ARVTarget.find().select("-__v");
        return res.status(200).json({ data: ARVTargets })
    }

    catch (error) {
        next(error);
    }
}

export const getAllQueuedARVTargets = async (_, res) => {

    try {
        const ARVTargets = await ARVTarget.find({ isQueued: true }).select("-__v");
        return res.status(200).json({ data: ARVTargets })
    }

    catch (error) {
        next(error);
    }
}

//will start the next game in the queue
export const getNextGame = async (_, res, next) => {

    try {

        const nextGame = await ARVTarget
            .findOneAndUpdate({ isCompleted: false, isQueued: true }, { isActive: true }, { new: true })
            .select("-isActive -isQueued -isCompleted -__v");

        return res.status(200).json({
            status: true,
            message: "Next game started successfully",
            data: nextGame
        });
    }

    catch (error) {
        next(error)
    }
}

export const updateUserSubmission = async (req, res, next) => {

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
        next(error);
    }
}

export const updateResultImage = async (req, res, next) => {

    const { id } = req.params;
    const { resultImage } = req.body;

    try {
        await ARVTarget.findByIdAndUpdate(id, { resultImage });
        return res.status(200).json({ message: "Result image updated successfully" });
    }

    catch (error) {
        next(error);
    }
}

export const updateAddToQueue = async (req, res, next) => {

    const { id } = req.params;

    try {
        await addToQueue(id, ARVTarget, res);
    }

    catch (error) {
        next(error);
    }
}

export const updateRemoveFromQueue = async (req, res, next) => {

    const { id } = req.params;

    try {
        await removeFromQueue(id, ARVTarget, res);
    }

    catch (error) {
        next(error);
    }
}

export const updateGameTime = async (req, res, next) => {

    const { id } = req.params;
    const { gameTime } = req.body;

    try {
        const { revealTime } = await ARVTarget.findById(id).select("revealTime")

        if (new Date(revealTime).getTime() < new Date(gameTime).getTime()) {
            return res.status(400).json({
                message: "Reveal time should be in the future or equal to game time"
            });
        }

        await ARVTarget.findByIdAndUpdate(id, { gameTime });
        return res.status(200).json({ message: "Game time updated successfully" });
    }

    catch (error) {
        next(error);
    }
}

export const updateBufferTime = async (req, res, next) => {

    const { id } = req.params;
    const { bufferTime } = req.body;

    try {

        const { outcomeTime } = await ARVTarget.findById(id).select("outcomeTime")

        if (new Date(outcomeTime).getTime() > new Date(bufferTime).getTime()) {
            return res.status(400).json({ message: "Buffer time should be in the future or equal to outcome time" })
        }

        await ARVTarget.findByIdAndUpdate(id, { bufferTime });
        return res.status(200).json({ message: "Buffer time updated successfully" });
    }

    catch (error) {
        next(error);
    }
}

export const updateMakeInactive = async (req, res, next) => {

    const { id } = req.params;

    try {
        await makeInActive(id, ARVTarget, res);
    }

    catch (error) {
        next(error);
    }
}

export const updateMakeComplete = async (req, res, next) => {

    const { id } = req.params;

    try {
        await ARVTarget.findByIdAndUpdate(id, { isCompleted: true }, { new: true });

        await CompletedTargets.findByIdAndUpdate(process.env.COMPLETED_TARGETS_DOCUMENT_ID, { $push: { ARVTargets: id } }, { new: true })

        return res.status(200).json({
            message: "Target completed successfully"
        });
    }

    catch (error) {
        next(error);
    }
}