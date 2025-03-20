import { ARVTarget } from "../model/ARVTarget.model.js";
import { TMCTarget } from "../model/TMCTarget.model.js";
import { startNextGameService, updateAddToQueueService, updateGameTimeService, updateMakeCompleteService, updateMakeInActiveService, updateRemoveFromQueueService, userInclusionInGameService } from "../services/ARVTMCServices/ARVTMCServices.js";
import { generateCode } from "../utils/generateCode.js";

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

//will start the next game from the queue
export const startNextGame = async (_, res, next) => {

    try {
        await startNextGameService(ARVTarget, res, next)
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
        await updateAddToQueueService(id, ARVTarget, res, next);
    }

    catch (error) {
        next(error);
    }
}

export const updateRemoveFromQueue = async (req, res, next) => {

    const { id } = req.params;

    try {
        await updateRemoveFromQueueService(id, ARVTarget, res, next)
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

export const updateGameTime = async (req, res, next) => {

    const { id } = req.params;
    const { gameTime } = req.body;

    try {
        await updateGameTimeService(id, gameTime, ARVTarget, res, next)
    }

    catch (error) {
        next(error);
    }
}

export const updateMakeInactive = async (req, res, next) => {

    const { id } = req.params;

    try {
        await updateMakeInActiveService(id, ARVTarget, res, next);
    }

    catch (error) {
        next(error);
    }
}

export const updateMakeComplete = async (req, res, next) => {

    const { id } = req.params;

    try {
        await updateMakeCompleteService(id, ARVTarget, "ARVTarget", res, next)
    }

    catch (error) {
        next(error);
    }
}

export const userInclusionInGame = async (req, res, next) => {

    const { id } = req.params;
    const userId = req.user._id;

    try {
        await userInclusionInGameService(id, userId, ARVTarget, res, next)
    }

    catch (error) {
        next(error)
    }
}