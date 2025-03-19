import { CompletedTargets } from "../model/completedTargets.model.js";
import { TMCTarget } from "../model/tmcTarget.model.js";
import { addToQueue } from "../utils/addToQueue.js";
import { generateCode } from "../utils/generateCode.js";
import { makeComplete } from "../utils/makeComplete.js";
import { makeInActive } from "../utils/makeInActive.js";
import { removeFromQueue } from "../utils/removeFromQueue.js";

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
export const getNextGame = async (_, res, next) => {

    try {

        const nextGame = await TMCTarget
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

export const updateAddToQueue = async (req, res, next) => {

    const { id } = req.params

    try {
        await addToQueue(id, TMCTarget, res);
    }

    catch (error) {
        next(error);
    }
}

export const updateRemoveFromQueue = async (req, res, next) => {

    const { id } = req.params

    try {
        await removeFromQueue(id, TMCTarget, res);
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

        const { revealTime } = await TMCTarget.findById(id).select("revealTime")

        if (new Date(revealTime).getTime() < new Date(gameTime).getTime()) {
            return res.status(400).json({
                message: "Reveal time should be in the future or equal to game time"
            });
        }

        await TMCTarget.findByIdAndUpdate(id, { gameTime }, { new: true });
        return res.status(200).json({
            message: "Game time updated successfully"
        });
    }

    catch (error) {
        next(error);
    }
}

export const updateMakeInactive = async (req, res, next) => {

    const { id } = req.params;

    try {
        await makeInActive(id, TMCTarget, res);
    }

    catch (error) {
        next(error);
    }
}

export const updateMakeComplete = async (req, res, next) => {

    const { id } = req.params;

    try {
        await TMCTarget.findByIdAndUpdate(id, { isCompleted: true }, { new: true });

        await CompletedTargets.findByIdAndUpdate(process.env.COMPLETED_TARGETS_DOCUMENT_ID, { $push: { TMCTargets: id } }, { new: true })

        return res.status(200).json({
            message: "Target completed successfully"
        });
    }

    catch (error) {
        next(error);
    }
}