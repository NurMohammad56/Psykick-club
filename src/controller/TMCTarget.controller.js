import { ARVTarget } from "../model/ARVTarget.model.js";
import { TMCTarget } from "../model/TMCTarget.model.js";
import { startNextGameService, updateAddToQueueService, updateGameTimeService, updateMakeCompleteService, updateMakeInActiveService, updateRemoveFromQueueService, userInclusionInGameService } from "../services/ARVTMCServices/ARVTMCServices.js";
import { generateCode } from "../utils/generateCode.js";

export const createTMCTarget = async (req, res, next) => {

    const { targetImage, controlImages, revealTime, bufferTime, gameTime } = req.body;

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

        else if (new Date(revealTime).getTime() > new Date(bufferTime).getTime()) {
            return res.status(400).json({
                message: "Buffer time should be in the future or equal to reveal time"
            });
        }

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

//will start the next game in the queue
export const startNextGame = async (_, res, next) => {

    try {
        await startNextGameService(TMCTarget, res, next)
    }

    catch (error) {
        next(error)
    }
}

export const updateAddToQueue = async (req, res, next) => {

    const { id } = req.params

    try {
        await updateAddToQueueService(id, TMCTarget, res, next);
    }

    catch (error) {
        next(error);
    }
}

export const updateRemoveFromQueue = async (req, res, next) => {

    const { id } = req.params

    try {

        await updateRemoveFromQueueService(id, TMCTarget, res, next)
    }

    catch (error) {
        next(error);
    }
}

export const updateBufferTime = async (req, res, next) => {

    const { id } = req.params;
    const { bufferTime } = req.body;

    try {

        const { revealTime } = await TMCTarget.findById(id).select("revealTime")

        if (new Date(revealTime).getTime() > new Date(bufferTime).getTime()) {
            return res.status(400).json({
                message: "Buffer time should be in the future or equal to reveal time"
            });
        }

        await TMCTarget.findByIdAndUpdate(id, { bufferTime }, { new: true });
        return res.status(200).json({
            message: "Buffer time updated successfully"
        });
    }

    catch (error) {
        next(error);
    }
}

export const updateGameTime = async (req, res, next) => {

    const { id } = req.params;
    const { gameTime } = req.body;

    try {
        await updateGameTimeService(id, gameTime, TMCTarget, res, next)
    }

    catch (error) {
        next(error);
    }
}

export const updateMakeInactive = async (req, res, next) => {

    const { id } = req.params;

    try {
        await updateMakeInActiveService(id, TMCTarget, res, next);
    }

    catch (error) {
        next(error);
    }
}

export const updateMakeComplete = async (req, res, next) => {

    const { id } = req.params;

    try {
        await updateMakeCompleteService(id, TMCTarget, "TMCTarget", res, next)
    }

    catch (error) {
        next(error);
    }
}

export const userInclusionInGame = async (req, res, next) => {

    const { id } = req.params;
    const userId = req.user._id

    try {
        await userInclusionInGameService(id, userId, TMCTarget, res, next)
    }

    catch (error) {
        next(error)
    }
}