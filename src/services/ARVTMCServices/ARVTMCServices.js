import { CompletedTargets } from "../../model/completedTargets.model.js";

export const startNextGameService = async (model, res, next) => {

    try {
        const nextGame = await model
            .findOneAndUpdate({ isCompleted: false, isQueued: true }, { isActive: true }, { new: true })
            .select("-isActive -isQueued -isCompleted -createdAt -updatedAt -__v")

        if (nextGame) {
            return res.status(200).json({
                status: true,
                message: "Next game started successfully",
                data: nextGame
            });
        }

        else {
            return res.status(404).json({
                status: false,
                message: "No game is active right now"
            })
        }
    }

    catch (error) {
        next(error)
    }
}

export const updateAddToQueueService = async (id, model, res, next) => {

    try {
        await model.findByIdAndUpdate(id, { isQueued: true }, { new: true })
        return res.status(200).json({
            status: true,
            message: "Added to queue successfully"
        });
    }

    catch (error) {
        next(error);
    }
}

export const updateRemoveFromQueueService = async (id, model, res, next) => {

    try {
        const isGameActive = await model.findOne({ _id: id, isActive: true })

        if (isGameActive) {
            return res.status(403).json({
                status: false,
                message: "Active game cannot be removed from queue"
            })
        }

        await model.findByIdAndUpdate(id, { isQueued: false }, { new: true })
        return res.status(200).json({
            status: true,
            message: "Removed from queue successfully"
        });
    }

    catch (error) {
        next(error);
    }
}

export const updateGameTimeService = async (id, gameTime, model, res, next) => {

    try {
        const { revealTime } = await model.findById(id).select("revealTime")

        if (new Date(revealTime).getTime() < new Date(gameTime).getTime()) {
            return res.status(400).json({
                message: "Reveal time should be in the future or equal to game time"
            });
        }

        await model.findByIdAndUpdate(id, { gameTime })
        return res.status(200).json({
            message: "Game time updated successfully"
        });
    }

    catch (error) {
        next(error)
    }

}

export const updateMakeInActiveService = async (id, model, res, next) => {

    try {
        await model.findByIdAndUpdate(id, { isActive: false }, { new: true })
        return res.status(200).json({
            status: true,
            message: "Game inactivated successfully"
        });
    }

    catch (error) {
        next(error);
    }
}

export const updateMakeCompleteService = async (id, model, targetName, res, next) => {

    try {
        const isGameActive = await model.findOne({ _id: id, isActive: true })

        if (isGameActive) {
            return res.status(403).json({
                status: false,
                message: "Active game cannot be marked as completed"
            })
        }

        await model.findByIdAndUpdate(id, { isCompleted: true, isQueued: false });

        await CompletedTargets.findByIdAndUpdate(process.env.COMPLETED_TARGETS_DOCUMENT_ID, { $push: { [targetName]: id } })

        return res.status(200).json({
            status: true,
            message: "Target completed successfully"
        });
    }

    catch (error) {
        next(error)
    }
}

export const userInclusionInGameService = async (id, userId, model, res, next) => {

    try {
        const isGameInActive = await model.findOne({ _id: id, isActive: false })

        if (isGameInActive) {
            return res.status(403).json({
                status: false,
                message: "Game time is over"
            })
        }

        const isUserIncluded = await model.findOne({ _id: id, userId: { $in: [userId] } })

        if (isUserIncluded) {
            return res.status(403).json({
                status: false,
                message: "User is already included to play the game"
            })
        }

        else {
            await model.findByIdAndUpdate(id, { $push: { userId } })

            return res.status(200).json({
                status: true,
                message: "User added to the game successfully"
            })
        }
    }

    catch (error) {
        next(error)
    }
}