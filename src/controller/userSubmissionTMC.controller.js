import { UserSubmissionTMC } from "../model/userSubmissionTMC.model.js";

export const createUserSubmissionTMC = async (req, res, next) => {
    const { user, firstChoice, secondChoice, TMCTarget } = req.body;

    try {
        const userSubmissionTMC = await UserSubmissionTMC.create({ user, firstChoice, secondChoice, TMCTarget });

        return res.status(201).json({ data: userSubmissionTMC });
    }

    catch (error) {
        next(error);
    }
}

export const getUserSubmissionTMCAndCalculatePoints = async (req, res, next) => {

    const { id } = req.params;

    try {

        const userSubmissionTMC = await UserSubmissionTMC.findById(id).select("-__v")
            .populate("firstChoice", "imageUrl title") // Populate firstChoice, fetching specific fields
            .populate("secondChoice", "imageUrl title") // Populate secondChoice
            .populate("TMCTarget", "targetName targetValue") // Populate TMCTarget
            .select("-__v"); // Exclude the '__v' field



        return res.status(200).json({ data: userSubmissionTMC });
    }

    catch (error) {
        next(error);
    }
}