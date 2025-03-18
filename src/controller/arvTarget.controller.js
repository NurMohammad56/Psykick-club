import { ARVTarget } from "../model/ARVTarget.model.js";
import { addToQueue } from "../utils/addToQueue.js";
import { generateCode } from "../utils/generateCode.js";
import { removeFromQueue } from "../utils/removeFromQueue.js";

export const createARVTarget = async (req, res, next) => {

    const { eventName, eventDescription, revealTime, outcomeTime, bufferTime, gameTime, image1, image2, image3, controlImage } = req.body;

    try {

        // let code;
        // let codeExists;

        // do {


        //     // Check for code existence in both collections in a single query
        //     const [arvCodes, tmcCodes] = await Promise.all([
        //         ARVTarget.distinct("code"),
        //         TMCTarget.distinct("code")
        //     ])

        // } while (arvCodes || tmcCodes); // Retry if any result is found

        if (new Date(revealTime) > new Date(outcomeTime)) {
            return res.status(400).json({ message: "Reveal time cannot be greater than Outcome time." })
        }

        const code = generateCode();

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

export const updateARVTargetAddToQueue = async (req, res, next) => {

    const { id } = req.params;

    try {
        await addToQueue(id, ARVTarget, res);
    }

    catch (error) {
        next(error);
    }
}

export const updateARVTargetRemoveFromQueue = async (req, res, next) => {

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
        await ARVTarget.findByIdAndUpdate(id, { bufferTime });
        return res.status(200).json({ message: "Buffer time updated successfully" });
    }

    catch (error) {
        next(error);
    }
}