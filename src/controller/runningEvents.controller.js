import { ARVTarget } from "../model/arvTarget.model.js";
import { TMCTarget } from "../model/tmcTarget.model.js";

export const getRunningEventsCount = async (_, res, next) => {

    try {
        const runningTMC = await TMCTarget.countDocuments({ isActive: true, isPartiallyActive: true });
        const runningARV = await ARVTarget.countDocuments({ isActive: true, isPartiallyActive: true });

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