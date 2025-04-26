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

export const getAllCompletedTargetsCount = async (_, res, next) => {
    try {
        const completedTargets = await CompletedTargets.findById(process.env.COMPLETED_TARGETS_DOCUMENT_ID);

        return res.status(200).json({
            status: true,
            data: {
                completedTMCCount: completedTargets?.TMCTargets?.length || 0,
                completedARVCount: completedTargets?.ARVTargets?.length || 0,
            },
            message: "All completed targets count fetched successfully"
        });
    }

    catch (error) {
        next(error);
    }
}