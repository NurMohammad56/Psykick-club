import { CompletedTargets } from "../model/completedTargets.model.js";

export const getAllCompletedTargets = async (_, res, next) => {

    try {
        const completedTargets = await CompletedTargets.find()
            .populate("ARVTargets")
            .populate("TMCTargets")
            .lean()

        return res.status(200).json({
            status: true,
            data: completedTargets,
            message: "All completed targets fetched successfully"
        });
    }

    catch (error) {
        next(error);
    }
}