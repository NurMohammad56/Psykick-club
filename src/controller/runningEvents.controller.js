import { ARVTarget } from "../model/ARVTarget.model.js";
import { TMCTarget } from "../model/TMCTarget.model.js";

export const getRunningEventsCount = async (_, res, next) => {

    try {
        const runningTMC = await TMCTarget.countDocuments({ isActive: true, isQueued: true });
        const runningARV = await ARVTarget.countDocuments({ isActive: true, isQueued: true });

        return res.status(200).json({
            status: true,
            data: runningARV + runningTMC,
            message: "Running events count fetched successfully"
        });
    }

    catch (error) {
        next(error)
    }
}